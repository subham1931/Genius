import { VideoClient } from "./video-client";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const VideoPage = async () => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();

    return (
        <VideoClient
            apiLimitCount={apiLimitCount}
            isPro={isPro}
        />
    );
}

export default VideoPage;
