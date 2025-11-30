import { Bell, Check, X, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { formatDistanceToNow } from 'date-fns';

export interface TripInvitation {
  id: string;
  tripId: string;
  tripName: string;
  fromUser: {
    firstName: string;
    lastName: string;
  };
  invitedAt: Date;
  status: 'pending' | 'accepted' | 'declined';
  tripDetails?: {
    stops: string[];
    startDate?: Date;
  };
}

interface NotificationsPageProps {
  invitations: TripInvitation[];
  onAcceptInvitation: (invitationId: string) => void;
  onDeclineInvitation: (invitationId: string) => void;
  onMarkAsRead: (invitationId: string) => void;
}

export function NotificationsPage({ 
  invitations, 
  onAcceptInvitation, 
  onDeclineInvitation,
  onMarkAsRead 
}: NotificationsPageProps) {
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const respondedInvitations = invitations.filter(inv => inv.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl">Notifications</h1>
          </div>
          <p className="text-gray-600">
            Stay updated on trip invitations and travel plans
          </p>
        </div>

        {/* No Notifications */}
        {invitations.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl text-gray-600 mb-2">No notifications yet</h2>
            <p className="text-gray-500">
              When someone invites you to join their trip, you'll see it here
            </p>
          </Card>
        )}

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              Pending Invitations
              <Badge variant="default" className="ml-2">
                {pendingInvitations.length}
              </Badge>
            </h2>
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <Card key={invitation.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                          {invitation.fromUser.firstName[0]}{invitation.fromUser.lastName[0]}
                        </div>
                        <div>
                          <p className="text-base">
                            <span className="font-medium">
                              {invitation.fromUser.firstName} {invitation.fromUser.lastName}
                            </span>
                            {' '}invited you to join their trip
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(invitation.invitedAt, { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      <div className="ml-13 mt-3">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900 mb-1">
                                {invitation.tripName}
                              </p>
                              {invitation.tripDetails && invitation.tripDetails.stops.length > 0 && (
                                <p className="text-sm text-gray-600">
                                  {invitation.tripDetails.stops.slice(0, 3).join(' → ')}
                                  {invitation.tripDetails.stops.length > 3 && ` +${invitation.tripDetails.stops.length - 3} more`}
                                </p>
                              )}
                            </div>
                          </div>
                          {invitation.tripDetails?.startDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                              <Calendar className="w-4 h-4" />
                              Starting {formatDistanceToNow(invitation.tripDetails.startDate, { addSuffix: true })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-3 ml-13">
                    <Button
                      onClick={() => onAcceptInvitation(invitation.id)}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept Invitation
                    </Button>
                    <Button
                      onClick={() => onDeclineInvitation(invitation.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Previous Responses */}
        {respondedInvitations.length > 0 && (
          <div>
            <h2 className="text-xl mb-4">Previous</h2>
            <div className="space-y-4">
              {respondedInvitations.map((invitation) => (
                <Card key={invitation.id} className="p-6 opacity-60">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                          {invitation.fromUser.firstName[0]}{invitation.fromUser.lastName[0]}
                        </div>
                        <div>
                          <p className="text-base">
                            <span className="font-medium">
                              {invitation.fromUser.firstName} {invitation.fromUser.lastName}
                            </span>
                            {' '}invited you to join their trip
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(invitation.invitedAt, { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      <div className="ml-13 mt-3">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium text-gray-900">
                            {invitation.tripName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-13 mt-4">
                    <Badge 
                      variant={invitation.status === 'accepted' ? 'default' : 'secondary'}
                      className={invitation.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                    >
                      {invitation.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
