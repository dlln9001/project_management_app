# Generated by Django 4.2.15 on 2024-09-07 06:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0010_item_board'),
    ]

    operations = [
        migrations.AddField(
            model_name='column',
            name='order',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
