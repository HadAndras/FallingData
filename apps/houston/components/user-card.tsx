import {Avatar, AvatarImage} from "@workspace/ui/src/components/avatar.tsx";
import {CardContent, CardTitle, CardHeader, Card} from "@workspace/ui/src/components/card.tsx";
import { UserResponse } from "@supabase/supabase-js";


export const UserAvatarCard = (user: UserResponse) => {
    const username: string = user?.data?.user?.user_metadata?.full_name || "??";
    const avatar =
        user?.data?.user?.user_metadata?.avatar_url || "/placeholder.svg";
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-center">Létrehozta</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatar} />
                    </Avatar>
                    <h4 className="text-lg font-semibold leading-none">{username}</h4>
                </div>
            </CardContent>
        </Card>
    );
}