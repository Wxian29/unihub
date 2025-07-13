from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('communities', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='communitymember',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='community_memberships', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='community',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_communities', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='communitymember',
            unique_together={('user', 'community')},
        ),
    ]
