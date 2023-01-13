import React, { useCallback, useEffect, useState } from 'react';
import { Actions, newDice } from "#src/Redux/Dice";
import { ComeBetAI, PassLineBetAI, PassLineOddsBetAI, ComeOddsBetAI, DontComeOddsBetAI, DontPassLineBetAI, DontComeBetAI } from '#src/Rules';
import { AutorollerActions } from '#src/Redux/Autoroller';
import { useAppDispatch, useAppSelector } from '#src/Redux/hooks';
export interface ConnectedAIProps {
};

export function ConnectedAI(props: ConnectedAIProps) {
    const dispatch = useAppDispatch();
    const [actionLog, setActionLog] = useState<Array<string>>([]);
    const appendLog = useCallback((newValue) => setActionLog([newValue].concat(actionLog)), [setActionLog, actionLog]);
    const table = useAppSelector((state) => state.table);
    const autoroll = useAppSelector((state) => state.autoroller.state.autoroll);
    const autorollInterval = useAppSelector((state) => state.autoroller.state.autorollInterval);
    const passLine = useAppSelector((state) => state.autoroller.state.passlineBet);
    const dontPassLine = useAppSelector((state) => state.autoroller.state.dontPassLineBet);
    const passLineOdds = useAppSelector((state) => state.autoroller.state.passLineOdds);
    const dontPassLineOdds = useAppSelector((state) => state.autoroller.state.dontPassLineOddsBet);
    const dontCome = useAppSelector((state) => state.autoroller.state.dontComeBet);
    const dontComeOdds = useAppSelector((state) => state.autoroller.state.dontComeOddsBet);
    const comeBet = useAppSelector((state) => state.autoroller.state.comeBet);
    const maxComeBets = useAppSelector((state) => state.autoroller.state.maxComeBets);
    const comeOdds = useAppSelector((state) => state.autoroller.state.comeOdds);
    const name = useAppSelector((state) => state.autoroller.state.name);
    const savedNames = useAppSelector((state) => state.autoroller.savedNames);

    useEffect(() => {
        const id = window.setInterval(() => {
            if (passLine !== undefined && passLine > 0) {
                PassLineBetAI(table, passLine, dispatch)
            }

            if (comeBet !== undefined && comeBet > 0) {
                ComeBetAI(table, comeBet, maxComeBets, dispatch)
            }
            if (passLineOdds !== undefined && passLineOdds > 0) {
                PassLineOddsBetAI(table, passLineOdds, dispatch)
            }

            if (comeOdds !== undefined && comeOdds > 0) {
                ComeOddsBetAI(table, comeOdds, dispatch)
            }
            
            if (dontCome !== undefined && dontCome > 0) {
                DontComeBetAI(table, dontCome, maxComeBets, dispatch)
            }
            
            if (dontComeOdds !== undefined && dontComeOdds > 0) {
                DontComeOddsBetAI(table, dontComeOdds, dispatch)
            }
            
            if (dontPassLine !== undefined && dontPassLine > 0) {
                DontPassLineBetAI(table, dontPassLine, dispatch)
            }
            
            if (autoroll) {
                dispatch(
                    Actions.rollDice(newDice())
                );
            }
            
        }, autorollInterval);
        return () => window.clearInterval(id);
    }, [
        table,
        dispatch,
        appendLog,
        autorollInterval,
        autoroll,
        passLine,
        passLineOdds,
        comeBet,
        comeOdds,
        maxComeBets,
        dontPassLine,
        dontPassLineOdds,
        dontCome,
        dontComeOdds
    ])
    let autoRollButton = 
        autoroll && 
        (<button onClick={() => dispatch(AutorollerActions.setAutoRoll(false) )}>DISABLE AUTOROLL</button> ) || 
        (<button onClick={() => dispatch(AutorollerActions.setAutoRoll(true) )}>ENABLE AUTOROLL</button> )
    return (
        <div className="grid grid-cols-3 gap-8 place-items-center">
          <span></span>
          {autoRollButton}
          <span></span>
          <span className="text-right w-full">Interval</span>
          <input className="w-full" type="range" min="5" max="1000" value={autorollInterval} onChange={(event) => {
              const value = +event.target.value;
              dispatch(AutorollerActions.setAutoInterval(value))
          }  }/>
          <span className="w-full text-left pl-2">{autorollInterval}ms</span>
          <TogglableNumber name="Pass Line Bet" count={passLine} setValue={(value) => { dispatch(AutorollerActions.setPassLine(value) ) }} />
          <TogglableNumber name="Dont Pass Line Bet" count={dontPassLine} setValue={(value) => { dispatch(AutorollerActions.setDontPassLine(value) ) }} />
          <TogglableNumber defaultValue="2" name="Pass Line Odds Bet" count={passLineOdds} setValue={(value) => { dispatch(AutorollerActions.setPassLineOdds(value) ) }} />
          <TogglableNumber name="Come Bet" count={comeBet} setValue={(value) => { dispatch(AutorollerActions.setComeBet(value) ) }} />
          <TogglableNumber name="Dont Come Bet" count={dontCome} setValue={(value) => { dispatch(AutorollerActions.setDontComeBet(value) ) }} />
          <TogglableNumber name="Dont Come Odds" count={dontComeOdds} setValue={(value) => { dispatch(AutorollerActions.setDontComeOdds(value) ) }} />
          <span className="text-right w-full">MAX COME BETS</span>
          <input className="w-full" type="range" step="1" min="0" max="7" value={maxComeBets} onChange={(event) => {
              const value = +event.target.value;
              if (value !== undefined) {
                  dispatch(AutorollerActions.setMaxComeBets(value))
              } else {
                  dispatch(AutorollerActions.setMaxComeBets(7))
              }
          }  }/>
          <span className="text-left w-full">{maxComeBets}</span>
          <TogglableNumber defaultValue="2" name="Come Odds Bet" count={comeOdds} setValue={(value) => { dispatch(AutorollerActions.setComeOdds(value) ) }} />
          <span className="w-full text-right pr-2">Name</span>
          <input type="text" size="10" className="text-lg" value={name} onChange={(event) => dispatch(AutorollerActions.setName(event.target.value)) } />
          <div>
            <button disabled={name.length === 0} onClick={() => { dispatch(AutorollerActions.saveStrategy())}} className="disabled:opacity-20
w-full text-center pl-2 pt-4 pb-4 cursor-pointer">SAVE</button>
            <button disabled={!savedNames.includes(name)} onClick={() => { dispatch(AutorollerActions.deleteStrategy())}} className="disabled:opacity-20
                                                                                                                                     pl-2 pb-4 pt-4 w-full text-center cursor-pointer">DELETE</button>
          </div>
          {savedNames.length > 0 && (
              <select className="col-span-3" value={name} onChange={(event) => dispatch(AutorollerActions.loadStrategy(event.target.value))} >
                {!savedNames.includes(name) && (<option key={name}>{name}</option>) || ""}
            {savedNames.map((savedName) => (<option key={savedName} value={savedName}>{savedName}</option>))}
              </select>
          )}
        </div>
    );
}

function TogglableNumber(props: { name: string, defaultValue?: number, count?: number, setValue: (value: number | undefined) => void }) {
    if (props.count !== undefined) {
        return (
            <>
              <span className="w-full text-right pr-2">{props.name}</span>
              <input className="text-center" type="text" value={props.count || 0} onChange={(event) => props.setValue(+event.target.value)} />
              <button className="w-full text-left pl-2" onClick={() => props.setValue(undefined)}>DISABLE</button>
            </>
        );
    } else {
        return (
            <>
              <span className="w-full text-right pr-2">{props.name}</span>
              <span>DISABLED</span>
              <button className="w-full text-left pl-2" onClick={() => props.setValue(props.defaultValue || 5)}>ENABLE</button>
            </>
        );
    }
}
