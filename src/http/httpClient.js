class HttpClient {

    static async get(url, options = {}) {

        const timeout = options.timeout ?? 10000;

        const controller = new AbortController();

        const timer = setTimeout(
            () => controller.abort(),
            timeout
        );

        try {

            const response = await fetch(url, {
                signal: controller.signal
            });

            clearTimeout(timer);

            if (!response.ok) {

                return {

                    success: false,

                    status: response.status,

                    error: response.statusText

                };

            }

            return {

                success: true,

                data: await response.json()

            };

        }
        catch (error) {

            clearTimeout(timer);

            return {

                success: false,

                status: 0,

                error: error.message

            };

        }

    }

}

window.HttpClient = HttpClient;