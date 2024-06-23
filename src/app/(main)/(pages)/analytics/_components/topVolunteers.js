import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TopVolunteers = ({ users }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Top Volunteers</h2>
          <p className="font-light">Time</p>
        </div>
      </CardHeader>
      <CardContent>
        {users
          .sort((a, b) => b.time - a.time)
          .slice(0, 5)
          .map((user, index) => {
            return (
              <>
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={user.image} alt="user" />
                      <AvatarFallback>
                        <p>
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </p>
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold">
                        {user.first_name} {user.last_name}
                      </h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    {Math.floor(user.time / 60)}:
                    {user.time % 60 < 10
                      ? `0${user.time % 60}`
                      : user.time % 60}
                  </p>
                </div>
                {index !== users.length - 1 && <Separator />}
              </>
            );
          })}
      </CardContent>
    </Card>
  );
};

export default TopVolunteers;
