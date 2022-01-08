import * as sst from "@serverless-stack/resources";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { CfnSubnetGroup, CfnCacheCluster } from "@aws-cdk/aws-elasticache";
import { SecurityGroup } from "@aws-cdk/aws-ec2";
import { Vpc } from "@aws-cdk/aws-ec2";


function domain_name(stage: string): string {
  if (stage === 'prod') {
    return  "craps-api.tdodge.consulting"
  } else {
    return `${stage}-craps-api.tdodge.consulting`
  }
}

export default class CrapsStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    // Define your stack
    const stage = scope.stage;
    const capacity = stage === 'prod' ? 10 : 1

    const players_table = new Table(this, 'craps-players-table', {
      tableName: `craps-players-${stage}`,
      timeToLiveAttribute: "Enabled=true, AttributeName=ttl",
      partitionKey: {
        name: 'playerId',
        type: AttributeType.STRING
      },
      readCapacity: capacity,
      writeCapacity: capacity,
    })
    
    const vpc = new Vpc(this, 'craps-vpc', {
      vpcName: `craps-vpc-${stage}`,
    })

    const securityGroup = new SecurityGroup(
      this,
      "vpc-security-group", {
        vpc: vpc,
        securityGroupName: `craps-vpc-sg-${stage}`,
        description: `Security group for craps ${stage}`
      }
    )
    
    const redisSubnetGroup = new CfnSubnetGroup(
      this,
      "redis-cluster",
      {
        cacheSubnetGroupName: `redis-subnet-${stage}`,
        description: "Subnet used for the redis cluster",
        subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
      }
    );
    
    const redisCluster = new CfnCacheCluster(
      this,
      `redis-craps-cache`,
      {
        engine: "redis",
        description: "Redis Replica Group",
        replicationGroupDescription: "Craps Redis",
        cacheNodeType: "cache.t3.micro",
        numCacheNodes: 1,
        automaticFailoverEnabled: true,
        autoMinorVersionUpgrade: true,
        vpcSecurityGroupIds: [securityGroup.securityGroupId],
        cacheSubnetGroupName: redisSubnetGroup.cacheSubnetGroupName
      }
    );
    redisCluster.addDependsOn(redisSubnetGroup);
    
    new sst.Api(this, "craps-api", {
      customDomain: {
        domainName: domain_name(stage),
        hostedZone: "tdodge.consulting",
        path: "v1"
      },
      httpApi: {
        apiName: `craps-api-${stage}`
      },
      routes: {
        "$default": {
          handler: "src/api.main",
          vpc: vpc,
          environment: { 
            DB_PLAYERS_TABLE: players_table.tableName,
            REDIS_HOST: redisCluster.attrRedisEndpointAddress,
            REDIS_PORT: redisCluster.attrRedisEndpointPort
          },
          permissions: [
            [players_table, 'grantReadWriteData']
          ]
        }
      }
    })
  }
}
