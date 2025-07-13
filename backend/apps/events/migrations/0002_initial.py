from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('events', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('communities', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventparticipant',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event_participations', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='event',
            name='community',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='communities.community'),
        ),
        migrations.AddField(
            model_name='event',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_events', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='eventparticipant',
            unique_together={('user', 'event')},
        ),
    ]
