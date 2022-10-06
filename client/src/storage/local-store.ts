import {db} from "./db";
import {Change} from "../common/change";


export class LocalStore {
    async loadAllChanges(): Promise<Change[]> {
        return db.changes.toArray();
    }

    async loadChanges(ids: string[]): Promise<Change[]> {
        return db.changes
          .where("id").anyOf(ids)
          .toArray();
    }

    async loadAllChangeIds(): Promise<string[]> {
        const changes = await db.changes.toArray();
        return changes.map(change => change.id);
    }

    async saveChange(change: Change): Promise<void> {
        await db.changes.add(change);
    }
}
