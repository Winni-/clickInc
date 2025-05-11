import { AppThunk } from './store';
import { GameState } from '../types';

export const applyEventEffect = (effect: (state: GameState) => void): AppThunk => 
  (dispatch, getState) => {
    const state = getState().game;
    const newState = { ...state };
    effect(newState);
    dispatch({ type: 'game/updateGameState', payload: newState });
  };

export const applyEventEffects = (effects: ((state: GameState) => void)[]): AppThunk =>
  (dispatch) => {
    effects.forEach(effect => dispatch(applyEventEffect(effect)));
  };