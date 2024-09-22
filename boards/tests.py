from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from user_authentication.models import User
from .models import Board
from .api.serializers import BoardFullSerializer

# Create your tests here.

class BoardTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.testUser = User.objects.create_user(username='test1234', password='1234')
        self.board = Board.objects.create(user=self.testUser)

    def test_get_board(self):
        self.client.force_authenticate(user=self.testUser)
        url = reverse('get-board')
        expected_board_info = BoardFullSerializer(self.board)
        response = self.client.post(url, {'board_id': self.board.id})
        self.assertEqual(response.data['boardInfo'], expected_board_info.data)
    
    def test_change_board_description(self):
        self.client.force_authenticate(user=self.testUser)
        url = reverse('change-board-description')
        expected_description = 'New Description'
        response = self.client.post(url, {'board_id': self.board.id, 'board_description': expected_description})
        self.board.refresh_from_db()
        self.assertEqual(self.board.description, expected_description)

    def test_change_board_name(self):
        self.client.force_authenticate(user=self.testUser)
        new_name = 'New Name'
        url = reverse('change-board-name')
        response = self.client.post(url, {'board_id': self.board.id, 'board_name': new_name}, format='json')
        self.board.refresh_from_db()
        self.assertEqual(self.board.name, new_name)
    
    def test_delete_board(self):
        self.client.force_authenticate(user=self.testUser)
        url = reverse('delete-board')
        initial_count = Board.objects.count()
        response = self.client.post(url, {'board_id': self.board.id}, format='json')
        self.assertEqual(Board.objects.count(), initial_count - 1)
        