import { type BoardType } from '@/utils/board';
import { type ActionType } from './ActionType';

export interface ActionModel {
  type: ActionType;
  value?: number;
}

export interface StorageModel {
  board?: number[];
  boardSize?: number;
  score?: number;
  best?: number;
  defeat?: boolean;
  victoryDismissed?: boolean;
  moves?: number[];
}

export interface Point {
  x: number;
  y: number;
}
