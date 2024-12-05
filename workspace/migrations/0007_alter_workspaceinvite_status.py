# Generated by Django 4.2.15 on 2024-12-04 23:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workspace', '0006_workspaceinvite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workspaceinvite',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending', max_length=30),
        ),
    ]
