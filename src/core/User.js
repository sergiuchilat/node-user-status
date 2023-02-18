class User {
    database = null
    dbFieldPrefix = 'user_';

    init(database) {
        this.database = database;
    }

    put(user) {
        this.database.set(`${this.dbFieldPrefix}${user.id}`, {
            id: Number(user.id),
            status: user.status,
            time: Date.now()
        });
    }

    get(status = 'all') {
        const keys = this.database.keys();
        const users = [];
        keys.forEach(key => {
            const user = { ...this.database.get(key) };

            if (status === 'all' || user.status === status) {
                users.push(user)
            }
        })

        return users;
    }

    getGroupedByStatus() {
        const list = {
            available: [],
            busy: [],
            away: []
        }
        this.get('all').forEach(user => {
            list[user.status].push(user.id);
        })

        return list;
    }

    updateStatusInTime() {
        const users = this.get('all');
        users.forEach(user => {

            if (['available', 'busy'].includes(user.status) && Date.now() > Number(user.time) + Number(process.env.STATUS_LIFETIME_AVAILABLE) * 1000) {
                this.database.set(`${this.dbFieldPrefix}${user.id}`, {
                    ...user,
                    status: 'away'
                });
            } else if (user.status === 'away' && Date.now() > Number(user.time) + Number(process.env.STATUS_LIFETIME_AWAY) * 1000) {
                this.database.delete(`${this.dbFieldPrefix}${user.id}`);
            }
        })
    }

    countByStatus() {
        const counter = {
            available: 0,
            busy: 0,
            away: 0
        }
        this.get('all').forEach(user => {
            counter[user.status]++;
        })

        return counter;
    }

    validateStatus(status) {
        if (!['all', 'available', 'busy', 'away'].includes(status)) {
            throw Error('imvalid-user-status')
        }
    }

}

module.exports = new User();