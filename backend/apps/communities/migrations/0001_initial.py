from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Community Name')),
                ('description', models.TextField(max_length=1000, verbose_name='Community Description')),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='community_avatars/', verbose_name='Community Avatars')),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='community_covers/', verbose_name='Community Covers')),
                ('is_public', models.BooleanField(default=True, verbose_name='Public')),
                ('max_members', models.PositiveIntegerField(default=1000, verbose_name='Maximum number of members')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creation time')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update time')),
            ],
            options={
                'verbose_name': 'Community',
                'verbose_name_plural': 'Community',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CommunityMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('admin', 'Admin'), ('moderator', 'Moderator'), ('member', 'Member')], default='member', max_length=20, verbose_name='Role')),
                ('joined_at', models.DateTimeField(auto_now_add=True, verbose_name='Join Time')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('community', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='members', to='communities.community')),
            ],
            options={
                'verbose_name': 'Community Member',
                'verbose_name_plural': 'Community Member',
                'ordering': ['-joined_at'],
            },
        ),
    ]
