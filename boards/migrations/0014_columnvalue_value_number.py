# Generated by Django 4.2.15 on 2024-09-29 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0013_board_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='columnvalue',
            name='value_number',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=20, null=True),
        ),
    ]