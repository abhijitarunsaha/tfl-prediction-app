const CacheKeys = {

    VERSION: "v1",

    squad(team) {
        return `tfl-${this.VERSION}-squad-${team}`;
    },

    fixtures() {
        return `tfl-${this.VERSION}-fixtures`;
    },

    tournament() {
        return `tfl-${this.VERSION}-tournament`;
    },

    lastSync() {
        return `tfl-${this.VERSION}-last-sync`;
    }

};

window.CacheKeys = CacheKeys;