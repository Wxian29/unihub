from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Event Title')),
                ('description', models.TextField(verbose_name='Event Description')),
                ('start_time', models.DateTimeField(verbose_name='Start time')),
                ('end_time', models.DateTimeField(verbose_name='End time')),
                ('location', models.CharField(max_length=200, verbose_name='Event Location')),
                ('max_participants', models.PositiveIntegerField(blank=True, null=True, verbose_name='Maximum number of participants')),
                ('current_participants', models.PositiveIntegerField(default=0, verbose_name='Current number of participants')),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('published', 'Published'), ('ongoing', 'Ongoing'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='draft', max_length=20, verbose_name='Status')),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='event_covers/', verbose_name='Event Covers')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creation time')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update time')),
            ],
            options={
                'verbose_name': 'Event',
                'verbose_name_plural': 'Event',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='EventParticipant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registered_at', models.DateTimeField(auto_now_add=True, verbose_name='Registration Period')),
                ('is_attended', models.BooleanField(default=False, verbose_name='Participation')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='events.event')),
            ],
            options={
                'verbose_name': 'Participants',
                'verbose_name_plural': 'Participants',
                'ordering': ['-registered_at'],
            },
        ),
    ]
