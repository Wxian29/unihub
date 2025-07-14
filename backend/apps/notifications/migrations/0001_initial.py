from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='Content')),
                ('type', models.CharField(choices=[('system', 'System'), ('community', 'Community'), ('event', 'Event'), ('other', 'Other')], default='system', max_length=20, verbose_name='Type')),
                ('is_read', models.BooleanField(default=False, verbose_name='Read')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creation time')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL, verbose_name='Receiver')),
            ],
            options={
                'verbose_name': 'Notify',
                'verbose_name_plural': 'Notify',
                'ordering': ['-created_at'],
            },
        ),
    ]
