class MockProvider {

    constructor() {

        this.squads = {

            Germany: [
                "Baumann",
                "Ter Stegen",
                "Nübel",
                "Rüdiger",
                "Tah",
                "Schlotterbeck",
                "Kimmich",
                "Raum",
                "Mittelstädt",
                "Anton",
                "Andrich",
                "Gross",
                "Pavlović",
                "Musiala",
                "Wirtz",
                "Sané",
                "Adeyemi",
                "Führich",
                "Gnabry",
                "Havertz",
                "Füllkrug",
                "Undav",
                "Beier"
            ],

            Paraguay: [
                "Coronel",
                "Fernández",
                "Balbuena",
                "Gómez",
                "Alderete",
                "Espinoza",
                "Cubas",
                "Villasanti",
                "Almirón",
                "Enciso",
                "Sosa",
                "Ramón Sosa",
                "Ávalos",
                "Mauricio"
            ],
            Argentina: ["Lionel Messi", "Julian Alvarez", "Lautaro Martinez", "Enzo Fernandez", "Alexis Mac Allister", "Angel Di Maria"],
            Brazil: ["Vinicius Junior", "Rodrygo", "Neymar", "Raphinha", "Endrick", "Lucas Paqueta"],
            France: ["Kylian Mbappe", "Antoine Griezmann", "Olivier Giroud", "Ousmane Dembele", "Aurelien Tchouameni", "Marcus Thuram"],
            England: ["Harry Kane", "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Cole Palmer", "Declan Rice"],
            Spain: ["Alvaro Morata", "Lamine Yamal", "Pedri", "Nico Williams", "Dani Olmo", "Ferran Torres"],
            Portugal: ["Cristiano Ronaldo", "Bruno Fernandes", "Bernardo Silva", "Rafael Leao", "Goncalo Ramos", "Joao Felix"],
            Netherlands: ["Memphis Depay", "Cody Gakpo", "Xavi Simons", "Wout Weghorst", "Donyell Malen", "Frenkie de Jong"],
            USA: ["Christian Pulisic", "Folarin Balogun", "Gio Reyna", "Tim Weah", "Weston McKennie", "Yunus Musah"],
            Turkey: ["Arda Guler", "Kenan Yildiz", "Hakan Calhanoglu", "Kerem Akturkoglu", "Baris Alper Yilmaz", "Orkun Kokcu"],
            Australia: ["Mathew Leckie", "Mitchell Duke", "Craig Goodwin", "Riley McGree", "Jackson Irvine", "Martin Boyle"],
            Iraq: ["Aymen Hussein", "Ali Jasim", "Ibrahim Bayesh", "Mohannad Ali", "Bashar Resan", "Amir Al-Ammari"],
            Norway: ["Erling Haaland", "Martin Odegaard", "Alexander Sorloth", "Oscar Bobb", "Antonio Nusa", "Fredrik Aursnes"],
            Mexico: ["Santiago Gimenez", "Hirving Lozano", "Uriel Antuna", "Edson Alvarez", "Luis Chavez", "Henry Martin"],
            Canada: ["Jonathan David", "Alphonso Davies", "Cyle Larin", "Tajon Buchanan", "Stephen Eustaquio", "Ismael Kone"],
            Japan: ["Kaoru Mitoma", "Takefusa Kubo", "Daichi Kamada", "Takumi Minamino", "Ritsu Doan", "Ayase Ueda"],
            Uruguay: ["Darwin Nunez", "Federico Valverde", "Luis Suarez", "Facundo Pellistri", "Giorgian de Arrascaeta", "Manuel Ugarte"],
            Croatia: ["Luka Modric", "Andrej Kramaric", "Bruno Petkovic", "Ivan Perisic", "Mateo Kovacic", "Marcelo Brozovic"],
            Morocco: ["Achraf Hakimi", "Hakim Ziyech", "Youssef En-Nesyri", "Sofiane Boufal", "Amine Harit", "Azzedine Ounahi"],
            Senegal: ["Sadio Mane", "Nicolas Jackson", "Ismaila Sarr", "Iliman Ndiaye", "Pape Matar Sarr", "Idrissa Gueye"],

            // Continue using the exact squad lists that currently exist in app.js

        };

    }

    getInfo() {

        return {

            name: "Mock",

            version: "1.0",

            supportsLiveScores: false,

            supportsSync: false

        };

    }

    async getTournament() {
        return {};
    }

    async getFixtures() {
        return [];
    }

    async getMatch(providerId) {
        return null;
    }

    async getSquad(teamName) {
        return [];
    }

    async getTournamentAwards() {

        return {

            goldenBoot: null,
            goldenBall: null,
            goldenGlove: null

        };

    }

    async syncTournament() {
        return [];
    }

}

window.MockProvider = MockProvider;