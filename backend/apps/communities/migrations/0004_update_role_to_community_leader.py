from django.db import migrations, models


def update_admin_to_community_leader(apps, schema_editor):
    """Update the existing admin role to community_leader"""
    CommunityMember = apps.get_model('communities', 'CommunityMember')
    CommunityMember.objects.filter(role='admin').update(role='community_leader')


def reverse_community_leader_to_admin(apps, schema_editor):
    """Roll back the community_leader role to admin"""
    CommunityMember = apps.get_model('communities', 'CommunityMember')
    CommunityMember.objects.filter(role='community_leader').update(role='admin')


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0003_alter_communitymember_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='communitymember',
            name='role',
            field=models.CharField(choices=[('community_leader', 'Community Leader'), ('member', 'Member')], default='member', max_length=20, verbose_name='Role'),
        ),
        migrations.RunPython(update_admin_to_community_leader, reverse_community_leader_to_admin),
    ]
