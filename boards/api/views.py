from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import Board
from .serializers import BoardFullSerializer
from ..models import Group
from .serializers import GroupSerializer
from ..models import Item
from .serializers import ItemSerializer
from ..models import Column
from .serializers import ColumnSerializer
from ..models import ColumnValue
from .serializers import ColumnValueSerializer


@api_view(['GET', 'POST'])
def get_board(request):
    board_id = request.data['board_id']
    board = Board.objects.get(id=board_id)
    serialized = BoardFullSerializer(board)
    return Response({'status': 'success', 'boardInfo': serialized.data})


@api_view(['GET', 'POST'])
def change_board_name(request):
    board = Board.objects.get(id=request.data['board_id'])
    board.name = request.data['board_name']
    board.save()
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def change_board_description(request):
    board = Board.objects.get(id=request.data['board_id'])
    board.description = request.data['board_description']
    board.save()
    return Response({'status': 'success'})


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
    # get groups
    groups = Group.objects.filter(board=board).order_by('order')
    # get columns
    columns = Column.objects.filter(board=board).order_by('order')
    columns_serialized = ColumnSerializer(columns, many=True)
    # get items and column values
    items_list = []
    all_column_values = []
    for group in groups:
        group_column_values = [] # will store the column values of the current group
        items = Item.objects.filter(group=group).order_by('order')
        for item in items:
            column_values = ColumnValue.objects.filter(item=item) # one item can have multiple column values
            column_values_serialized = ColumnValueSerializer(column_values, many=True)
            group_column_values.append(column_values_serialized.data)
        items_serialized = ItemSerializer(items, many=True)
        items_list.append(items_serialized.data)
        all_column_values.append(group_column_values)
    serialized = GroupSerializer(groups, many=True)
    return Response({'status': 'success', 'groupsInfo': serialized.data, 'itemsInfo': items_list, 'columnValues': all_column_values, 'columnsInfo': columns_serialized.data})


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
    board = Board.objects.get(id=request.data['board_id'])
    all_items = Item.objects.filter(group=group)
    number_of_items = len(all_items)
    item = Item.objects.create(group=group, name=request.data['name'], order=number_of_items, board=board)
    item.save()
    # make column values for the newly created item
    all_columns = Column.objects.filter(board=board)
    for column in all_columns:
        column_value = ColumnValue.objects.create(column=column, item=item)
        column_value.save()
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


@api_view(['GET', 'POST'])
def create_column(request):
    board = Board.objects.get(id=request.data['board_id'])
    all_columns = Column.objects.filter(board=board)
    num_of_columns = len(all_columns)
    column = Column.objects.create(name=request.data['column_type'], column_type=request.data['column_type'], board=board, order=num_of_columns)
    column.save()
    all_items = Item.objects.filter(board=board)
    for item in all_items:
        column_value = ColumnValue.objects.create(item=item, column=column)
        column_value.save()
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def delete_column(request):
    column = Column.objects.get(id=request.data['column_id'])
    column.delete()
    # now reorder the columns
    board = Board.objects.get(id=request.data['board_id'])
    all_columns = Column.objects.filter(board=board).order_by('order')
    index = 0
    for column in all_columns:
        column.order = index
        column.save()
        index += 1
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def edit_column_name(request):
    column = Column.objects.get(id=request.data['column_id'])
    column.name = request.data['column_name']
    column.save()
    return Response({'status': 'success'})


@api_view(['GET', 'POST'])
def edit_column_value(request):
    column_value = ColumnValue.objects.get(id=request.data['column_value_id'])
    column_value.value_color = request.data['color']
    column_value.value_text = request.data['text']
    column_value.save()
    return Response({'status': 'success'})