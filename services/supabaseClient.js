const tflSupabase = window.supabase.createClient(
    window.TFL_CONFIG.SUPABASE_URL,
    window.TFL_CONFIG.SUPABASE_ANON_KEY
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