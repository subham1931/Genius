import { MusicClient } from "./music-client";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const MusicPage = async () => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();

    return (
        <MusicClient
            apiLimitCount={apiLimitCount}
            isPro={isPro}
        />
    );
}

export default MusicPage;
