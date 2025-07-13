from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='communitymember',
            name='role',
            field=models.CharField(choices=[('admin', 'Admin'), ('member', 'Member')], default='member', max_length=20, verbose_name='Role'),
        ),
    ]
