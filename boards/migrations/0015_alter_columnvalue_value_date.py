# Generated by Django 4.2.15 on 2024-10-02 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0014_columnvalue_value_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='columnvalue',
            name='value_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]