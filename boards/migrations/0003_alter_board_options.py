# Generated by Django 4.2.15 on 2024-11-25 20:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0002_itemupdate'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='board',
            options={'ordering': ['order']},
        ),
    ]
