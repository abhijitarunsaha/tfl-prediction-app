const RepositoryBase = {

    async execute(query, operation = "Database operation") {

        try {

            const {

                data,

                error

            } = await query;

            if (error) {

                console.error(

                    `${operation} failed`,

                    error

                );

                return null;

            }

            return data;

        }

        catch (exception) {

            console.error(

                `${operation} exception`,

                exception

            );

            return null;

        }

    },

    success(result) {

        return result !== null;

    }

};

window.RepositoryBase =
    RepositoryBase;