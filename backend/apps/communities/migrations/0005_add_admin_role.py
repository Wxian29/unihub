from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0004_update_role_to_community_leader'),
    ]

    operations = [
        migrations.AlterField(
            model_name='communitymember',
            name='role',
            field=models.CharField(choices=[('admin', 'Admin'), ('community_leader', 'Community Leader'), ('member', 'Member')], default='member', max_length=20, verbose_name='Role'),
        ),
    ]
