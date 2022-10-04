

export interface Change {
    id: string,
    change: string
}

export class LocalStore {
    async loadAllChanges(): Promise<Change[]> {
       const changeString = localStorage.getItem("changes");
       if (changeString) {
           return JSON.parse(changeString);
       }
       return [];
    }

    async loadChanges(ids: string[]) {
        const changes = await this.loadAllChanges();
        return changes.filter(change => ids.includes(change.id));
    }

    async loadAllChangeIds() {
        const changes = await this.loadAllChanges();
        return changes.map(change => change.id);
    }

    async addChange(change: Change) {
        const changes = await this.loadAllChanges();
        changes.push(change);
        await this._saveChanges(changes);
    }

    async _saveChanges(changes: Change[]) {
        localStorage.setItem("changes", JSON.stringify(changes));
    }
}
