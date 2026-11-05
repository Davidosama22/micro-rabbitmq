import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { UserDocument } from "../../../../apps/auth/src/users/models/user.schema";



const getCurrentUserByContext = (context: ExecutionContext):UserDocument => {
    if (context.getType<GqlContextType>() === 'graphql') {
        return GqlExecutionContext.create(context).getContext<{ req: { user: UserDocument } }>().req.user;
    }
    const request = context.switchToHttp().getRequest<{ user: UserDocument }>();
    return request.user
}

export const CurrentUser = createParamDecorator((data:unknown, context:ExecutionContext) => {
    return getCurrentUserByContext(context);
});
