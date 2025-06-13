import { type StorageModel } from '@/types/Models';

const ITEM_NAME = '2048_data';

export function getStoredData(): StorageModel {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(ITEM_NAME);
    if (!storedData) return {};

    try {
      const data = JSON.parse(storedData) as StorageModel;

      // Validasi struktur data yang diperlukan
      const requiredFields = ['board', 'boardSize', 'score', 'defeat', 'victoryDismissed'];
      if (!requiredFields.every(field => Object.hasOwn(data, field))) {
        throw new Error('Invalid stored data: Missing required fields');
      }

      // Validasi tipe data
      if (
        !Array.isArray(data.board) ||
        typeof data.boardSize !== 'number' ||
        data.board.length !== data.boardSize ** 2 ||
        typeof data.score !== 'number' ||
        typeof data.defeat !== 'boolean' ||
        typeof data.victoryDismissed !== 'boolean' ||
        (data.moves && !Array.isArray(data.moves)) // Validasi opsional untuk moves
      ) {
        throw new Error('Invalid stored data: Incorrect types');
      }

      // Validasi nilai board (harus 0 atau pangkat 2)
      for (const value of data.board) {
        if (typeof value !== 'number') {
          throw new Error('Invalid stored data: Board values must be numbers');
        }
        if (value !== 0 && Math.log2(value) % 1 !== 0) {
          throw new Error('Invalid stored data: Board values must be powers of 2');
        }
      }

      // Validasi opsional best
      if (data.best !== undefined && typeof data.best !== 'number') {
        throw new Error('Invalid stored data: Best must be a number');
      }

      return {
        board: [...data.board], // Salin array untuk mencegah mutasi langsung
        boardSize: data.boardSize,
        score: data.score,
        defeat: data.defeat,
        victoryDismissed: data.victoryDismissed,
        moves: data.moves ? [...data.moves] : [], // Tambahkan moves jika ada
        best: data.best,
      };
    } catch (error) {
      console.error('Error parsing stored data:', error);
      localStorage.removeItem(ITEM_NAME);
      return {};
    }
  }
  return {};
}

export function setStoredData(model: StorageModel) {
  const dataToStore: StorageModel = {
    board: model.board ? [...model.board] : [],
    boardSize: model.boardSize || 4,
    score: model.score || 0,
    defeat: model.defeat || false,
    victoryDismissed: model.victoryDismissed || false,
    moves: model.moves ? [...model.moves] : [], // Simpan moves untuk mode off-chain
    best: model.best || 0,
  };
  localStorage.setItem(ITEM_NAME, JSON.stringify(dataToStore));
}