from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0005_add_admin_role'),
    ]

    operations = [
        migrations.CreateModel(
            name='InterestTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='Tag Name')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('color', models.CharField(default='#007bff', max_length=7, verbose_name='Tag Color')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Interest Tag',
                'verbose_name_plural': 'Interest Tags',
                'ordering': ['name'],
            },
        ),
        migrations.AlterModelOptions(
            name='community',
            options={'ordering': ['-created_at'], 'verbose_name': 'Community', 'verbose_name_plural': 'Communities'},
        ),
        migrations.AlterModelOptions(
            name='communitymember',
            options={'verbose_name': 'Community Member', 'verbose_name_plural': 'Community Members'},
        ),
        migrations.RemoveField(
            model_name='community',
            name='avatar',
        ),
        migrations.RemoveField(
            model_name='community',
            name='max_members',
        ),
        migrations.AlterField(
            model_name='community',
            name='cover_image',
            field=models.ImageField(blank=True, null=True, upload_to='community_covers/', verbose_name='Cover Image'),
        ),
        migrations.AlterField(
            model_name='community',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='community',
            name='description',
            field=models.TextField(verbose_name='Description'),
        ),
        migrations.AlterField(
            model_name='community',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='communitymember',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='communitymember',
            name='joined_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='communitymember',
            name='role',
            field=models.CharField(choices=[('member', 'Member'), ('admin', 'Admin'), ('community_leader', 'Community Leader')], default='member', max_length=20),
        ),
        migrations.AddField(
            model_name='community',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='communities', to='communities.interesttag', verbose_name='Interest Tags'),
        ),
    ]
