import Dexie, { Table } from 'dexie';
import {Change} from "../common/change";


export class ChangesDatabase extends Dexie {
  changes!: Table<Change>;

  constructor() {
    super('changes');
    this.version(1).stores({
      changes: '&id'
    });
  }
}

export const db = new ChangesDatabase();
