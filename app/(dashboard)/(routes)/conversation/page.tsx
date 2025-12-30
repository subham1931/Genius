import { ConversationClient } from "./conversation-client";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const ConversationPage = async () => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();

    return (
        <ConversationClient
            apiLimitCount={apiLimitCount}
            isPro={isPro}
        />
    );
}

export default ConversationPage;
