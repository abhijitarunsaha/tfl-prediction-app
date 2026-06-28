const tflSupabase = window.supabase.createClient(
    Config.supabase.url,
    Config.supabase.anonKey
);

window.supabaseClient = tflSupabase;

async function testSupabaseConnection() {

    const { data, error } =
        await tflSupabase
            .from("contestants")
            .select("*")
            .limit(1);

    if (error) {

        console.error("Supabase connection failed");

        console.error(error);

        return;
    }

    console.log("✅ Supabase Connected");

}