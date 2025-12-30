import { CodeClient } from "./code-client";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const CodePage = async () => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();

    return (
        <CodeClient
            apiLimitCount={apiLimitCount}
            isPro={isPro}
        />
    );
}

export default CodePage;
