# Generated by Django 4.2.15 on 2024-08-23 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='type',
            field=models.CharField(default='board', editable=False, max_length=50),
        ),
    ]
