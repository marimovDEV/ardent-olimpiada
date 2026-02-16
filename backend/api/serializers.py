from rest_framework import serializers
from django.db.models import Sum
from django.contrib.auth.hashers import make_password
from .models import (
    OlympiadRegistration, TestResult, Certificate, SupportTicket,
    TicketMessage, Payment, BotConfig, LevelReward, User, Course, Lesson, Enrollment, Olympiad, Question,
    HomePageConfig, HomeStat, HomeStep, HomeAdvantage, FreeCourseSection, FreeCourseLessonCard, Subject, TeacherProfile, Notification,
    Profession, ProfessionSubject, ProfessionRoadmapStep, UserProfessionProgress,
    Module, LessonPractice, LessonTest, Lead, LessonProgress,
    Testimonial, Winner, Banner, AIAssistantFAQ,
    NotificationTemplate, NotificationBroadcast,
    AIConversation, AIMessage, AIUnansweredQuestion, OlympiadPrize, WinnerPrize, PrizeAddress,
    TeacherWallet, Transaction, Payout, LessonContent, Homework, HomeworkSubmission
)

# ============= CMS SERIALIZERS =============


class WinnerSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = Winner
        fields = ['id', 'subject', 'subject_name', 'stage', 'student_name', 'region', 'score', 'position', 'image', 'is_featured']


class AIAssistantFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAssistantFAQ
        fields = '__all__'

# ============= NOTIFICATION SERIALIZERS =============

class NotificationSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at', format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'is_read', 'timestamp', 'link', 'broadcast']

class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = '__all__'

# ============= AI SERIALIZERS =============

class AIConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIConversation
        fields = '__all__'

class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMessage
        fields = '__all__'

class AIUnansweredQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIUnansweredQuestion
        fields = '__all__'

class NotificationBroadcastSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    course_name = serializers.CharField(source='course.title', read_only=True)
    olympiad_name = serializers.CharField(source='olympiad.title', read_only=True)
    audience_type_display = serializers.CharField(source='get_audience_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = NotificationBroadcast
        fields = '__all__'



# ============= USER SERIALIZERS =============

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['bio', 'experience_years', 'specialization', 'telegram_username', 
                  'instagram_username', 'youtube_channel', 'linkedin_profile', 
                  'verification_status', 'rejection_reason', 'approved_at', 'approved_by', 'is_premium']


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    teacher_profile = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name',
                  'phone', 'avatar', 'avatar_url', 'role', 'xp', 'level', 'level_progress', 'balance',
                  'birth_date', 'region', 'school', 'grade', 'language', 'password',
                  'telegram_id', 'telegram_linking_token', 'telegram_connected_at',
                  'is_active', 'is_staff', 'is_superuser', 'last_login', 'date_joined', 'teacher_profile', 'subjects']
        read_only_fields = ['id', 'date_joined', 'xp', 'level', 'last_login', 
                            'telegram_id', 'telegram_linking_token', 'telegram_connected_at',
                            'teacher_profile', 'subjects']
    
    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            try:
                return obj.avatar.url
            except:
                return None
        return None

    def get_teacher_profile(self, obj):
        try:
            profile = obj.teacher_profile
            return TeacherProfileSerializer(profile).data
        except:
            return None

    def get_subjects(self, obj):
        if obj.role == 'TEACHER':
            return [{'id': s.id, 'name': s.name, 'color': s.color} for s in obj.subjects.all()]
        return []

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    email = serializers.EmailField(required=False, allow_blank=True) # Make email optional

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'phone', 'role']
    
    def validate(self, data):
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords must match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# Wallet Serializers
class TeacherWalletSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.username', read_only=True)
    
    class Meta:
        model = TeacherWallet
        fields = ['id', 'teacher', 'teacher_name', 'balance', 'pending_balance', 
                  'total_earned', 'total_withdrawn', 'created_at', 'updated_at']
        read_only_fields = ['id', 'teacher', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'transaction_type_display', 'user', 'user_name',
                  'course', 'course_title', 'amount', 'status', 'status_display',
                  'payment_provider', 'payment_id', 'description', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']


class PayoutSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.username', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Payout
        fields = ['id', 'teacher', 'teacher_name', 'amount', 'status', 'status_display',
                  'payment_method', 'payment_method_display', 'payment_details',
                  'approved_by', 'approved_by_name', 'approved_at', 'paid_at',
                  'rejection_reason', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'approved_by', 'approved_at', 'paid_at']


# Import wallet models at the top of file
from .models import TeacherWallet, Transaction, Payout


class UserRegisterSerializer_OLD(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    email = serializers.EmailField(required=False, allow_blank=True) # Make email optional

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'phone', 'role']
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Bu foydalanuvchi nomi band")
        return value
    
    def validate(self, data):
        password = data.get('password')
        password_confirm = data.get('password_confirm')
        if password_confirm and password != password_confirm:
            raise serializers.ValidationError({"password_confirm": "Parollar mos kelmaydi"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        validated_data['password'] = make_password(validated_data['password'])
        # Allow role setting (e.g. for teachers) if provided
        return super().create(validated_data)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField()


class UserMiniSerializer(serializers.ModelSerializer):
    """Minimal user info for nested serializers"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'phone', 'avatar', 'language']
    
    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


# ============= COURSE SERIALIZERS =============


class HomePageConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePageConfig
        fields = ['id', 'hero_title', 'hero_subtitle', 'hero_button_text', 
                  'hero_button_link', 'hero_image', 'cta_title', 'cta_subtitle', 
                  'cta_button_text', 'cta_button_link', 
                  'teaser_title_uz', 'teaser_title_ru', 'teaser_subtitle_uz', 'teaser_subtitle_ru',
                  'teaser_image', 'teaser_button_text_uz', 'teaser_button_text_ru', 'teaser_button_link',
                  'updated_at',
                  'show_stats', 'show_olympiads', 'show_courses', 'show_professions',
                  'show_testimonials', 'show_mentors', 'show_winners', 'show_steps', 'show_cta', 'show_faq']
        read_only_fields = ['id', 'updated_at']


class HomeStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeStat
        fields = ['id', 'label', 'value', 'icon', 'order', 'is_active']


class HomeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeStep
        fields = ['id', 'title', 'description', 'icon', 'order', 'is_active']


class HomeAdvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeAdvantage
        fields = ['id', 'title', 'description', 'icon', 'order', 'is_active']


class FreeCourseSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreeCourseSection
        fields = '__all__'


class FreeCourseLessonCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreeCourseLessonCard
        fields = '__all__'


class LessonContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonContent
        fields = ['id', 'lesson', 'text_content', 'resources_file', 'created_by', 'created_at', 'updated_at']


class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = ['id', 'lesson', 'title', 'description', 'deadline', 'created_at']


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    class Meta:
        model = HomeworkSubmission
        fields = ['id', 'student', 'student_name', 'homework', 'file_url', 'grade', 'feedback', 'status', 'submitted_at']


class LessonSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'module', 'title', 'description', 'video_url', 'pdf_url', 
                  'video_duration', 'duration', 'order', 'is_free', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_duration(self, obj):
        if obj.video_duration:
            return obj.video_duration // 60
        return 10 # Default fallback


class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['course', 'module', 'title', 'description', 'video_url', 'pdf_url', 
                  'video_duration', 'order', 'is_free']



class SubjectSerializer(serializers.ModelSerializer):
    courses_count = serializers.SerializerMethodField()
    olympiads_count = serializers.SerializerMethodField()
    professions_count = serializers.SerializerMethodField()
    
    stats = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color', 'xp_reward', 
                  'is_featured', 'is_active', 'order', 'courses_count', 'olympiads_count', 'professions_count', 'stats']
    
    def get_stats(self, obj):
        return {
            'students': obj.courses.filter(is_active=True).aggregate(count=Sum('students_count'))['count'] or 0,
            'olympiads': obj.olympiads_api.count()
        }
    
    def get_courses_count(self, obj):
        return obj.courses.filter(is_active=True).count()
    
    def get_olympiads_count(self, obj):
        return obj.olympiads_api.count()
    
    def get_professions_count(self, obj):
        return obj.profession_links.count()

    def get_teacher_avatar(self, obj):
        if obj.teacher and obj.teacher.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.teacher.avatar.url)
            return obj.teacher.avatar.url
        return None
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()

    def get_is_enrolled(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return Enrollment.objects.filter(user=user, course=obj).exists()
        return False

    def validate(self, attrs):
        # We need to call the model's clean() method for business logic validation
        # especially when activating a course.
        instance = self.instance
        if instance:
            # Create a temporary instance to validate without saving
            for key, value in attrs.items():
                setattr(instance, key, value)
            
            try:
                instance.clean()
            except serializers.ValidationError as e:
                raise e
            except Exception as e:
                from django.core.exceptions import ValidationError as DjangoValidationError
                if isinstance(e, DjangoValidationError):
                    raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else e.messages)
                raise e
                
        return attrs


class SubjectDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer for subject page with related content"""
    courses_count = serializers.SerializerMethodField()
    olympiads_count = serializers.SerializerMethodField()
    professions_count = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()
    olympiads = serializers.SerializerMethodField()
    professions = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color', 'xp_reward', 
                  'is_featured', 'is_active', 'order', 
                  'courses_count', 'olympiads_count', 'professions_count',
                  'courses', 'olympiads', 'professions']
    
    def get_courses_count(self, obj):
        return obj.courses.filter(is_active=True).count()
    
    def get_olympiads_count(self, obj):
        return obj.olympiads_api.count()
    
    def get_professions_count(self, obj):
        return obj.profession_links.count()
    
    def get_courses(self, obj):
        """Return courses for this subject"""
        from django.db.models import Count
        courses = obj.courses.filter(is_active=True)[:12]
        return [{
            'id': c.id,
            'title': c.title,
            'thumbnail': self.context['request'].build_absolute_uri(c.thumbnail.url) if c.thumbnail else None,
            'price': c.price,
            'level': c.level,
            'lesson_count': c.modules.aggregate(count=Count('lessons'))['count'] or 0,
        } for c in courses]
    
    def get_olympiads(self, obj):
        """Return upcoming/active olympiads for this subject"""
        from django.utils import timezone
        now = timezone.now()
        # Include UPCOMING and ONGOING olympiads that are active
        olympiads = obj.olympiads_api.filter(
            is_active=True, 
            status__in=['UPCOMING', 'ONGOING']
        ).order_by('status', 'start_date')[:6]
        
        # Refresh status for each to be sure
        for o in olympiads:
            o.refresh_status()
            
        return [{
            'id': o.id,
            'title': o.title,
            'slug': o.slug,
            'start_date': o.start_date,
            'status': o.status,
            'price': o.price,
        } for o in olympiads]
    
    def get_professions(self, obj):
        """Return professions that require this subject"""
        links = obj.profession_links.select_related('profession')[:6]
        return [{
            'id': link.profession.id,
            'name': link.profession.name,
            'icon': link.profession.icon,
            'color': link.profession.color,
            'percentage': link.percentage,
        } for link in links]

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'is_video_watched', 'video_last_position', 
                  'practice_score', 'test_score', 'is_completed', 'completed_at']

class LessonPracticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonPractice
        fields = ['id', 'type', 'problem_text', 'points'] # Don't show correct_answer

# ============= QUESTION SERIALIZERS =============

class QuestionSerializer(serializers.ModelSerializer):
    """Question serializer for students (no correct_answer)"""
    class Meta:
        model = Question
        fields = ['id', 'text', 'type', 'options', 'points', 'order', 'time_limit']

class QuestionAdminSerializer(serializers.ModelSerializer):
    """Question serializer for admins (includes correct_answer)"""
    olympiad = serializers.PrimaryKeyRelatedField(queryset=Olympiad.objects.all())
    correct_answer = serializers.CharField(required=False, allow_blank=True)
    options = serializers.JSONField(required=False, allow_null=True)
    explanation = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Question
        fields = ['id', 'olympiad', 'text', 'options', 'correct_answer', 'explanation', 'points', 'order', 'time_limit', 'code_template'] # Full admin fields

class LessonTestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = LessonTest
        fields = ['id', 'min_pass_score', 'max_attempts', 'questions']


class LearningLessonSerializer(serializers.ModelSerializer):
    """Specialized serializer for the learning interface"""
    duration = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    is_locked = serializers.SerializerMethodField()
    practice = LessonPracticeSerializer(read_only=True)
    test = LessonTestSerializer(read_only=True)
    content = LessonContentSerializer(read_only=True)
    homework = HomeworkSerializer(read_only=True)
    
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'video_url', 'youtube_id', 'video_type', 
                  'video_duration', 'duration', 'pdf_url', 'order', 'is_free', 
                  'progress', 'is_locked', 'practice', 'test', 'content', 'homework']

    def get_duration(self, obj):
        if obj.video_duration:
            return obj.video_duration // 60
        return 10

    def get_progress(self, obj):
        # Data passed from service to_attr='my_progress'
        progress = getattr(obj, 'my_progress', [])
        if progress:
            return {
                "is_video_watched": progress[0].is_video_watched,
                "practice_score": progress[0].practice_score,
                "test_score": progress[0].test_score,
                "is_completed": progress[0].is_completed
            }
        return None

    def get_is_locked(self, obj):
        return getattr(obj, 'is_locked', False)


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LearningLessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'description', 'order', 'lessons']


class CourseSerializer(serializers.ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
    teacher_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'admin', 'description', 'thumbnail', 'subject', 'subject_name',
            'level', 'price', 'teacher_percentage', 'platform_percentage',
            'is_active', 'status', 'lessons_count', 'students_count',
            'rating', 'teacher_name', 'teacher_avatar', 'created_at'
        ]

    def get_subject_name(self, obj):
        if obj.subject:
            return obj.subject.name
        return None

    def get_teacher_name(self, obj):
        if obj.teacher:
            return obj.teacher.full_name or obj.teacher.get_full_name() or obj.teacher.username
        return None

    def get_teacher_avatar(self, obj):
        if obj.teacher and obj.teacher.avatar:
            return obj.teacher.avatar.url
        return None


class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_details = SubjectSerializer(source='subject', read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    enrollment = serializers.SerializerMethodField()
    
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'admin', 'description', 'thumbnail', 'price', 'level',
                  'level_display', 'status', 'status_display', 'subject', 'subject_name', 'subject_details', 'language', 'duration', 'lessons_count', 
                  'teacher_percentage', 'platform_percentage',
                  'rating', 'students_count', 'is_featured', 'is_active', 'xp_reward',
                  'is_enrolled', 'enrollment', 'created_at', 'updated_at', 'lessons', 'modules']

    def get_subject_name(self, obj):
        if obj.subject:
            return obj.subject.name
        return None

    def get_is_enrolled(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return Enrollment.objects.filter(user=user, course=obj).exists()
        return False

    def get_enrollment(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            enrollment = Enrollment.objects.filter(user=user, course=obj).first()
            if enrollment:
                return {
                    'id': enrollment.id,
                    'progress': float(enrollment.progress),
                    'current_lesson': enrollment.current_lesson.id if enrollment.current_lesson else None,
                    'updated_at': enrollment.updated_at
                }
        return None


class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title', 'description', 'thumbnail', 'price', 'level',
                  'subject', 'language', 'duration', 'is_featured', 'is_active', 'status', 'xp_reward']


class UserProfessionProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfessionProgress
        fields = ['id', 'status', 'progress_percent', 'started_at', 'updated_at']

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    progress_percent = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'progress', 'progress_percent', 
                  'current_lesson', 'completed_at', 'created_at', 'updated_at']
    
    def get_progress_percent(self, obj):
        return f"{float(obj.progress):.0f}%"




# --- Teacher Serializers (with internal data) ---

class TeacherLessonPracticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonPractice
        fields = ['id', 'lesson', 'type', 'problem_text', 'correct_answer', 'points']

class TeacherLessonTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonTest
        fields = ['id', 'lesson', 'min_pass_score', 'max_attempts', 'questions']


class TeacherLessonSerializer(serializers.ModelSerializer):
    practice = TeacherLessonPracticeSerializer(read_only=True)
    test = TeacherLessonTestSerializer(read_only=True)
    content = LessonContentSerializer(read_only=True)
    homework = HomeworkSerializer(read_only=True)
    
    class Meta:
        model = Lesson
        fields = '__all__'

class TeacherModuleSerializer(serializers.ModelSerializer):
    lessons = TeacherLessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'description', 'order', 'lessons']

class TeacherCourseDetailSerializer(serializers.ModelSerializer):
    modules = TeacherModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'thumbnail', 'price', 'level',
                  'subject', 'duration', 'is_featured', 'is_active', 'xp_reward',
                  'created_at', 'updated_at', 'modules']




# ============= OLYMPIAD SERIALIZERS =============



class OlympiadPrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OlympiadPrize
        fields = ['id', 'olympiad', 'name', 'image', 'description', 'condition', 'value']


class PrizeAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrizeAddress
        fields = '__all__'


class WinnerPrizeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    olympiad_title = serializers.CharField(source='olympiad.title', read_only=True)
    address = serializers.SerializerMethodField()
    prize_item_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = WinnerPrize
        fields = ['id', 'olympiad', 'olympiad_title', 'student', 'student_name', 
                  'position', 'status', 'status_display', 'prize_item', 'prize_item_name', 
                  'address', 'awarded_at', 'updated_at']

    def get_address(self, obj):
        try:
            addr = obj.address
            return PrizeAddressSerializer(addr).data
        except:
            return None

    def get_prize_item_name(self, obj):
        if obj.prize_item:
            return obj.prize_item.name
        return None


class OlympiadSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()
    participants_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    time_remaining = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    prizes = OlympiadPrizeSerializer(many=True, read_only=True)
    start_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Olympiad
        fields = ['id', 'title', 'slug', 'description', 'thumbnail', 'subject', 'subject_id', 'profession', 'course',
                  'rules', 'prizes', 'evaluation_criteria',
                  'start_date', 'end_date', 'duration', 
                  'price', 'is_paid', 'currency', 'discount_percent',
                  'max_participants', 'status', 'status_display', 'is_active', 
                  'grade_range', 'level', 'difficulty', 'format',
                  'max_attempts', 'tab_switch_limit', 'required_camera', 'required_full_screen', 'disable_copy_paste',
                  'questions_count', 'xp_reward', 'participants_count', 'time_remaining', 'is_registered', 'is_completed', 'created_at',
                  'eligibility_grades', 'eligibility_regions', 'technical_config', 'certificate_config', 'start_time']
    
    def get_start_time(self, obj):
        return obj.start_date
    
    def validate(self, data):
        """
        Custom validation for Olympiad.
        Ensure it has questions before moving beyond DRAFT status.
        """
        status = data.get('status')
        # Check if status is being changed to something other than DRAFT
        if status and status not in ['DRAFT', 'CANCELED']:
            # If we are creating, we might not have questions yet, but we shouldn't allow UPCOMING/PUBLISHED status immediately
            # If we are updating, we can check existing questions
            if self.instance:
                if self.instance.questions.count() == 0:
                    raise serializers.ValidationError({
                        "status": "Savollar qo'shilmagan olimpiadani aktivlashtirib bo'lmaydi. Avval savollarni qo'shing."
                    })
            else:
                # For creation, if status is not DRAFT, it's risky. Force DRAFT for new ones if no questions.
                # But creation usually doesn't include questions yet in the same request.
                pass
        return data

    def to_representation(self, instance):
        # Automatically refresh status on view
        instance.refresh_status()
        return super().to_representation(instance)

    def get_questions_count(self, obj):
        return obj.questions.count()
    
    def get_participants_count(self, obj):
        return obj.registrations.count()
    
    def get_time_remaining(self, obj):
        from django.utils import timezone
        
        if not obj.start_date or not obj.end_date:
             return None

        now = timezone.now()
        if now < obj.start_date:
            delta = obj.start_date - now
            days = delta.days
            hours = delta.seconds // 3600
            minutes = (delta.seconds % 3600) // 60
            if days > 0:
                return f"{days}d {hours}h {minutes}m"
            return f"{hours}h {minutes}m"
        elif now < obj.end_date:
            delta = obj.end_date - now
            hours = delta.seconds // 3600
            minutes = (delta.seconds % 3600) // 60
            return f"{hours}h {minutes}m"
        return None

    def get_is_registered(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return OlympiadRegistration.objects.filter(user=user, olympiad=obj).exists()
        return False

    def get_is_completed(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return TestResult.objects.filter(user=user, olympiad=obj, status='COMPLETED').exists()
        return False


class OlympiadDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    is_registered = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    total_score = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Olympiad
        fields = ['id', 'title', 'slug', 'description', 'subject', 'subject_id', 'thumbnail',
                  'start_date', 'end_date', 'duration', 'price', 'status', 'questions',
                  'rules', 'prizes', 'evaluation_criteria', 'max_attempts', 'tab_switch_limit', 'disable_copy_paste',
                  'is_registered', 'is_completed', 'total_score', 'start_time']

    def get_start_time(self, obj):
        return obj.start_date

    def get_is_registered(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return OlympiadRegistration.objects.filter(user=user, olympiad=obj).exists()
        return False

    def get_is_completed(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return TestResult.objects.filter(user=user, olympiad=obj, status='COMPLETED').exists()
        return False

    def get_total_score(self, obj):
        return sum(q.points for q in obj.questions.all())


class OlympiadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Olympiad
        fields = ['title', 'slug', 'description', 'subject', 'subject_id', 'thumbnail',
                  'start_date', 'end_date', 'duration', 'price', 
                  'max_participants', 'status', 'is_active', 'xp_reward',
                  'rules', 'prizes', 'evaluation_criteria',
                  'grade_range', 'level', 'difficulty', 'format',
                  'is_paid', 'max_attempts', 'tab_switch_limit', 
                  'time_limit_per_question', 'is_random', 'cannot_go_back',
                  'required_camera', 'required_full_screen', 'disable_copy_paste', 'allowed_ip_range']


class OlympiadRegistrationSerializer(serializers.ModelSerializer):
    olympiad = OlympiadSerializer(read_only=True)
    user = UserMiniSerializer(read_only=True)
    
    class Meta:
        model = OlympiadRegistration
        fields = ['id', 'user', 'olympiad', 'is_paid', 'registered_at']


class TestResultSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    olympiad = OlympiadSerializer(read_only=True)
    correct_answers = serializers.SerializerMethodField()
    total_questions = serializers.SerializerMethodField()
    
    class Meta:
        model = TestResult
        fields = ['id', 'user', 'olympiad', 'answers', 'score', 
                  'percentage', 'time_taken', 'submitted_at', 'status', 'disqualified_reason', 'correct_answers', 'total_questions']

    def get_correct_answers(self, obj):
        # For now return score as proxy for correct count
        # (Assuming 1 point per question, or just showing points)
        return int(obj.score)

    def get_total_questions(self, obj):
        return obj.olympiad.questions.count()

class TestSubmitSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(),
        allow_empty=True
    )
    time_taken = serializers.IntegerField(min_value=0)
    tab_switches = serializers.IntegerField(min_value=0, default=0, required=False)


# ============= CERTIFICATE SERIALIZERS =============

class CertificateSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True, required=True
    )
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source='course', write_only=True, required=False, allow_null=True
    )
    olympiad_id = serializers.PrimaryKeyRelatedField(
        queryset=Olympiad.objects.all(), source='olympiad', write_only=True, required=False, allow_null=True
    )
    course_title = serializers.CharField(source='course.title', read_only=True)
    olympiad_title = serializers.CharField(source='olympiad.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_cert_type_display', read_only=True)
    verified_by_name = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    title = serializers.CharField(read_only=True)
    verify_url = serializers.CharField(read_only=True)
    
    class Meta:
        model = Certificate
        fields = ['id', 'cert_number', 'cert_type', 'type_display', 'user', 'user_id',
                  'course', 'course_id', 'course_title', 'olympiad', 'olympiad_id', 'olympiad_title', 
                  'title', 'source', 'grade', 'score', 'status', 'status_display', 
                  'issued_at', 'verified_at', 'verified_by', 'verified_by_name',
                  'rejection_reason', 'verify_url', 'qr_code', 'pdf_file']
    
    def get_source(self, obj):
        if obj.course:
            return {'type': 'course', 'title': obj.course.title, 'id': obj.course.id}
        elif obj.olympiad:
            return {'type': 'olympiad', 'title': obj.olympiad.title, 'id': obj.olympiad.id}
        return None
    
    def get_verified_by_name(self, obj):
        if obj.verified_by:
            return obj.verified_by.get_full_name() or obj.verified_by.username
        return None


class CertificateVerifySerializer(serializers.ModelSerializer):
    """Public verification serializer - limited info"""
    user_name = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    type_display = serializers.CharField(source='get_cert_type_display', read_only=True)
    
    class Meta:
        model = Certificate
        fields = ['cert_number', 'cert_type', 'type_display', 'user_name', 
                  'source', 'grade', 'score', 'status', 'issued_at', 'verified_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    
    def get_source(self, obj):
        if obj.course:
            return obj.course.title
        elif obj.olympiad:
            return obj.olympiad.title
        return None


class CertificateRejectSerializer(serializers.Serializer):
    """Serializer for rejecting a certificate"""
    reason = serializers.CharField(required=True, min_length=10, 
                                   help_text="Rad etish sababi (kamida 10 belgi)")


# ============= SUPPORT SERIALIZERS =============

class TicketMessageSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    
    class Meta:
        model = TicketMessage
        fields = ['id', 'sender_id', 'sender_name', 'message', 
                  'is_internal', 'is_admin', 'created_at']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.user.role != 'ADMIN' and instance.is_internal:
            return None
        return ret
    
    def get_is_admin(self, obj):
        try:
            user = User.objects.get(id=obj.sender_id)
            return user.role == 'ADMIN'
        except (User.DoesNotExist, ValueError):
            return False


class SupportTicketSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    messages = TicketMessageSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    messages_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'ticket_number', 'user', 'subject', 'category', 
                  'priority', 'priority_display', 'status', 'status_display',
                  'messages_count', 'created_at', 'updated_at', 'messages']
    
    def get_messages_count(self, obj):
        return obj.messages.count()


class SupportTicketListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list view"""
    user = UserMiniSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    messages_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'ticket_number', 'user', 'subject', 'category', 
                  'priority', 'priority_display', 'status', 'status_display',
                  'messages_count', 'last_message', 'created_at', 'updated_at']
    
    def get_messages_count(self, obj):
        return obj.messages.count()
    
    def get_last_message(self, obj):
        last = obj.messages.last()
        if last:
            return {
                'sender': last.sender_name,
                'message': last.message[:100],
                'created_at': last.created_at
            }
        return None


class CreateTicketSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    category = serializers.ChoiceField(choices=[
        ('Payment', 'To\'lov'),
        ('Technical', 'Texnik'),
        ('Course', 'Kurs'),
        ('Olympiad', 'Olimpiada'),
        ('Certificate', 'Sertifikat'),
        ('Other', 'Boshqa'),
    ])
    priority = serializers.ChoiceField(
        choices=['LOW', 'MEDIUM', 'HIGH'], 
        default='MEDIUM'
    )
    message = serializers.CharField(min_length=10)


# ============= PAYMENT SERIALIZERS =============

class PaymentSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    reference_title = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = ['id', 'user', 'amount', 'type', 'reference_id', 
                  'reference_title', 'method', 'status', 'status_display',
                  'transaction_id', 'created_at', 'completed_at']
    
    def get_reference_title(self, obj):
        if obj.type == 'COURSE':
            try:
                course = Course.objects.get(id=obj.reference_id)
                return course.title
            except Course.DoesNotExist:
                return None
        elif obj.type == 'OLYMPIAD':
            try:
                olympiad = Olympiad.objects.get(id=obj.reference_id)
                return olympiad.title
            except Olympiad.DoesNotExist:
                return None
        return None


class PaymentCreateSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=['COURSE', 'OLYMPIAD'])
    reference_id = serializers.CharField()
    method = serializers.ChoiceField(
        choices=['PAYME', 'CLICK', 'UZCARD'],
        default='PAYME'
    )


# ============= BOT SERIALIZERS =============

class BotConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotConfig
        fields = ['id', 'bot_token', 'admin_chat_id', 'humo_bot_url', 'click_merchant_id', 'is_active', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class PublicBotConfigSerializer(serializers.ModelSerializer):
    """Safe serializer for public/student use"""
    class Meta:
        model = BotConfig
        fields = ['humo_bot_url', 'is_active']


class LevelRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelReward
        fields = ['id', 'level', 'xp_threshold', 'reward_description', 'icon']




# ============= PROFESSION SERIALIZERS =============

class ProfessionSubjectSerializer(serializers.ModelSerializer):
    subject_id = serializers.IntegerField(source='subject.id')
    name = serializers.CharField(source='subject.name')
    slug = serializers.CharField(source='subject.slug')
    icon = serializers.CharField(source='subject.icon')
    color = serializers.CharField(source='subject.color')
    
    class Meta:
        model = ProfessionSubject
        fields = ['subject_id', 'name', 'slug', 'icon', 'color', 'importance', 'percentage', 'order']


class ProfessionRoadmapStepSerializer(serializers.ModelSerializer):
    step_type_display = serializers.CharField(source='get_step_type_display', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_id = serializers.IntegerField(source='course.id', read_only=True)
    is_course_completed = serializers.SerializerMethodField()
    
    class Meta:
        model = ProfessionRoadmapStep
        fields = ['id', 'title', 'description', 'step_type', 'step_type_display', 
                  'course_id', 'course_title', 'is_mandatory', 'is_course_completed', 'order']

    def get_is_course_completed(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated and obj.course:
            return Enrollment.objects.filter(user=user, course=obj.course, progress__gte=100).exists()
        return False


class ProfessionSerializer(serializers.ModelSerializer):
    required_subjects = ProfessionSubjectSerializer(many=True, read_only=True)
    roadmap_steps = ProfessionRoadmapStepSerializer(many=True, read_only=True)
    user_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Profession
        fields = ['id', 'name', 'description', 'icon', 'color', 'is_active', 'order',
                  'suitability', 'requirements', 'salary_range', 'learning_time', 
                  'certification_info', 'career_opportunities',
                  'required_subjects', 'roadmap_steps', 'user_progress']

    def get_user_progress(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            progress = UserProfessionProgress.objects.filter(user=user, profession=obj).first()
            if progress:
                return UserProfessionProgressSerializer(progress).data
        return None


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'name', 'phone', 'telegram_username', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

# ============= CMS SERIALIZERS =============

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'name', 'profession', 'text_uz', 'text_ru', 'image', 'instagram_url', 'rating', 'is_active', 'is_highlighted', 'created_at']
        extra_kwargs = {
            'rating': {'required': False},
            'is_active': {'required': False},
            'is_highlighted': {'required': False},
            'text_ru': {'required': False},
            'instagram_url': {'required': False},
        }

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'title', 'subtitle', 'image', 'mobile_image', 'button_text', 'button_link', 'order', 'is_active', 'created_at']


# Import Settings Serializers
from .serializers_settings import (
    PlatformSettingsSerializer,
    SecuritySettingsSerializer,
    NotificationSettingsSerializer,
    PaymentProviderConfigSerializer,
    PermissionSerializer,
    RolePermissionSerializer,
    AuditLogSerializer
)
