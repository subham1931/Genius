import { ImageClient } from "./image-client";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const ImagePage = async () => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();

    return (
        <ImageClient
            apiLimitCount={apiLimitCount}
            isPro={isPro}
        />
    );
}

export default ImagePage;
