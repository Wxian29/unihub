from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='Content')),
                ('image', models.ImageField(blank=True, null=True, upload_to='post_images/', verbose_name='Image')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Creation time')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update time')),
            ],
            options={
                'verbose_name': 'Post',
                'verbose_name_plural': 'Post',
                'ordering': ['-created_at'],
            },
        ),
    ]
