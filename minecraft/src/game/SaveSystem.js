export class SaveSystem {
  static SAVE_KEY = 'MINECRAFT_WEB_3D_SAVE_V1';

  static saveGame(saveData) {
    try {
      const serialized = {
        seed: saveData.seed,
        player: {
          x: saveData.player.position.x,
          y: saveData.player.position.y,
          z: saveData.player.position.z,
          rx: saveData.player.rotation.x,
          ry: saveData.player.rotation.y,
          mode: saveData.player.gameMode,
          health: saveData.player.health,
          hunger: saveData.player.hunger
        },
        modifiedBlocks: Array.from(saveData.world.modifiedBlocks.entries()),
        hotbar: saveData.inventory.hotbarSlots,
        inventory: saveData.inventory.inventorySlots,
        timestamp: Date.now()
      };

      localStorage.setItem(this.SAVE_KEY, JSON.stringify(serialized));
      return true;
    } catch (e) {
      console.error('Failed to save game state to localStorage:', e);
      return false;
    }
  }

  static loadGame() {
    try {
      const dataStr = localStorage.getItem(this.SAVE_KEY);
      if (!dataStr) return null;
      return JSON.parse(dataStr);
    } catch (e) {
      console.error('Failed to load game state:', e);
      return null;
    }
  }

  static clearSave() {
    localStorage.removeItem(this.SAVE_KEY);
  }
}
