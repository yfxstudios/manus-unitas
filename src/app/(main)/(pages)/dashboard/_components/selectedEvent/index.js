import { getCurrentUser, getEvent, getUsers, handleAccept, handleDecline, incrementTime } from '@/app/actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { longDate } from '@/lib/util/date'
import { standardTime } from '@/lib/util/time'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const SelectedEvent = ({ selectedEvent, setSelectedEvent, deleteEvent }) => {
  const { data, isSuccess, mutate } = useMutation({
    mutationKey: 'event',
    mutationFn: () => getEvent(selectedEvent._id)
  })

  useEffect(() => {
    mutate()

  }, [selectedEvent])

  const searchParams = useSearchParams()
  const id = searchParams.get('id')


  useEffect(() => {
    if (id && !selectedEvent) {
      setSelectedEvent({ _id: id })
    }
  }, [id])





  const { data: users, isFetched: usersFetched } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  const { data: user, isFetched: userFetched } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser
  })

  const onAccept = async (id) => {
    await handleAccept(id)

    incrementTime(user._id, id, true)

    setSelectedEvent({
      ...selectedEvent,
      accepted: [...selectedEvent.accepted, user._id]
    })

    mutate()
  }

  const onDecline = async (id) => {
    await handleDecline(id)

    incrementTime(user._id, id, false)

    setSelectedEvent({
      ...selectedEvent,
      rejected: [...selectedEvent.rejected, user._id]
    })

    mutate()
  }

  const onDelete = async (id) => {
    users.forEach(volunteer => {
      if (selectedEvent.accepted.includes(volunteer._id)) incrementTime(volunteer._id, id, false)
      if (selectedEvent.rejected.includes(volunteer._id)) incrementTime(volunteer._id, id, true)
    })

    await deleteEvent(id)


    setSelectedEvent(null)

    mutate()
  }

  if (!selectedEvent) return <p>Select an event to view more information</p>

  if (isSuccess && usersFetched && userFetched) {
    return (
      <>
        {isSuccess && usersFetched && userFetched && data && (
          <>
            {data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-row justify-between items-center">
                    <div className="flex-1 text-wrap break-words hyphens-auto">
                      {data.title}
                    </div>

                  </CardTitle>
                  <CardDescription>
                    {data.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-wrap break-words hyphens-auto text-sm xs:text-base">
                  <p>{longDate(data.date)}</p>
                  <p>
                    {standardTime(data.startTime)} to{" "}
                    {standardTime(data.endTime)}
                  </p>
                  <br />
                  <div className="flex flex-col space-y-4">
                    {users.map(volunteer => (
                      <div
                        key={volunteer._id}
                        className="flex flex-row gap-4 items-center"
                      >
                        <Avatar className="flex-shrink-0 h-12 w-12 hidden xs:flex">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>
                            {volunteer.first_name[0]}
                            {volunteer.last_name[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <h1 className="text-sm xs:text-lg font-semibold">
                            {volunteer.first_name} {volunteer.last_name}
                          </h1>
                          <p className="text-xs">{volunteer.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-end">
                  <div className="flex flex-row flex-wrap gap-4">
                    <Button
                      disabled={data.accepted.includes(
                        user._id
                      )}
                      onClick={e => {
                        onAccept(data._id);
                      }}
                    >
                      Accept Position
                    </Button>
                    <Button
                      disabled={data.rejected.includes(
                        user._id
                      )}
                      onClick={e => {
                        onDecline(data._id);
                      }}
                    >
                      Decline Position
                    </Button>
                    {user.admin && (
                      <Button
                        variant="destructive"
                        onClick={e => {
                          onDelete(data._id);
                        }}
                      >
                        Delete Event
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </>

    )
  }
}

export default SelectedEvent

