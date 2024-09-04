from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import Board
from .serializers import BoardFullSerializer
from ..models import Group
from .serializers import GroupSerializer
from ..models import Item
from .serializers import ItemSerializer

@api_view(['GET', 'POST'])
def get_board(request):
    board_id = request.data['board_id']
    board = Board.objects.get(id=board_id)
    serialized = BoardFullSerializer(board)
    return Response({'status': 'success', 'boardInfo': serialized.data})


@api_view(['GET', 'POST'])
def create_group(request):
    board_id = request.data['board_id']
    board = Board.objects.get(id=board_id)
    # all groups of that board
    all_groups = Group.objects.filter(board=board)
    num_of_groups = len(all_groups)
    group = Group.objects.create(board=board, order=num_of_groups)
    group.save()
    return Response({'status': 'success'})

@api_view(['GET', 'POST'])
def delete_group(request):
    group = Group.objects.get(id=request.data['group_id'])
    group.delete()
    # now reorder the groups
    board = Board.objects.get(id=request.data['board_id'])
    # all groups of that board
    all_groups = Group.objects.filter(board=board).order_by('order')
    index = 0
    for group in all_groups:
        group.order = index
        group.save()
        index += 1
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def get_groups(request):
    board_id = request.data['board_id']
    board = Board.objects.get(id=board_id)
    groups = Group.objects.filter(board=board).order_by('order')
    items_list = []
    for x in groups:
        items = Item.objects.filter(group=x).order_by('order')
        items_serialized = ItemSerializer(items, many=True)
        items_list.append(items_serialized.data)
    serialized = GroupSerializer(groups, many=True)
    return Response({'status': 'success', 'groupsInfo': serialized.data, 'itemsInfo': items_list})


@api_view(['GET', 'POST'])
def edit_group_name(request):
    group = Group.objects.get(id=request.data['group_id'])
    group.name = request.data['group_name']
    group.save()
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def edit_group_color(request):
    group = Group.objects.get(id=request.data['group_id'])
    group.color = request.data['group_color']
    group.save()
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def create_item(request):
    group = Group.objects.get(id=request.data['group_id'])
    all_items = Item.objects.filter(group=group)
    number_of_items = len(all_items)
    item = Item.objects.create(group=group, name=request.data['name'], order=number_of_items)
    item.save()
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def edit_item(request):
    item = Item.objects.get(id=request.data['item_id'])
    item_name = request.data['item_name']
    item.name = item_name
    item.save()
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def delete_item(request):
    items = Item.objects.filter(id__in=request.data['item_ids'])
    items.delete()
    return Response({'status': 'success'})