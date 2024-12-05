import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.group_name = f'notifications_user_{self.user.id}'

        async_to_sync(self.channel_layer.group_add) (
            self.group_name,
            self.channel_name
        )

        self.accept()
        print(self.user, self.user.id, 'print user')
        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'connected'
        }))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard) (
            self.group_name,
            self.channel_name
        )
    
    def send_notification(self, event):
        self.send(text_data=json.dumps(event['message']))