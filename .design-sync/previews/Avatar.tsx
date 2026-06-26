import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from 'facturia-ui';

export function Single() {
  return (
    <div className="p-4 flex gap-4 items-center">
      <Avatar>
        <AvatarFallback>ED</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>PL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function Group() {
  return (
    <div className="p-4">
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>ED</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>PL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount count={3} />
      </AvatarGroup>
    </div>
  );
}
