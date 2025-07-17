# seed.py
from app import app, db # Import app and db from your main Flask app file
from models import Student, Project # Import your models
from faker import Faker
import random
from werkzeug.security import generate_password_hash # Import for consistent password hashing

# Initialize Faker
fake = Faker()

def generate_fake_data(num_students=10, num_projects_per_student=3):
    with app.app_context():
        print("Clearing existing data...")
        # Clear existing data to prevent duplicates on successive runs
        Project.query.delete()
        Student.query.delete()
        db.session.commit()
        print("Existing data cleared.")

        students = []
        for _ in range(num_students):
            name = fake.name()
            email = fake.email()
            password = "password123" # A common dummy password for testing
            github = fake.url() if random.random() > 0.3 else None # Some might not have
            linkedin = fake.url() if random.random() > 0.3 else None # Some might not have

            # Generate random skills
            all_possible_skills = ["React", "Node.js", "Python", "Flask", "SQLAlchemy", "PostgreSQL",
                                   "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap",
                                   "Django", "Ruby on Rails", "Java", "C++", "Docker", "AWS",
                                   "Machine Learning", "Data Science", "UI/UX Design", "Figma",
                                   "Mobile Development", "Android", "iOS", "Swift", "Kotlin"]
            num_skills = random.randint(1, 5)
            # Pick unique random skills
            student_skills = random.sample(all_possible_skills, num_skills)
            skills_str = ','.join(student_skills) if student_skills else None


            student = Student(
                name=name,
                email=email,
                github=github,
                linkedin=linkedin,
                skills=skills_str,
                role="student" # Ensure role is consistent
            )
            student.set_password(password) # Hash the password
            students.append(student)

        db.session.add_all(students)
        db.session.commit()
        print(f"Generated {len(students)} fake students.")

        projects = []
        categories = ["Web Development", "Mobile App", "Data Science", "UI/UX Design", "Game Development", "Other"]
        statuses = ["Pending", "Approved", "Rejected"]

        for student in students:
            for _ in range(random.randint(1, num_projects_per_student)): # Each student gets 1 to N projects
                title = fake.catch_phrase()
                category = random.choice(categories)
                description = fake.paragraph(nb_sentences=5)
                github_link = fake.url()
                demo_link = fake.url() if random.random() > 0.5 else None # Some projects might not have a demo link
                for_sale = fake.boolean(chance_of_getting_true=25) # 25% chance of being for sale
                price = round(random.uniform(50.0, 5000.0), 2) if for_sale else 0.0
                file_url = fake.image_url() # Placeholder, you'd replace with actual upload logic or dummy paths
                status = random.choice(statuses)

                project = Project(
                    title=title,
                    category=category,
                    description=description,
                    github_link=github_link,
                    demo_link=demo_link,
                    for_sale=for_sale,
                    price=price,
                    file_url=file_url,
                    status=status,
                    student_id=student.id
                )
                projects.append(project)

        db.session.add_all(projects)
        db.session.commit()
        print(f"Generated {len(projects)} fake projects.")
        print("Fake data seeding complete!")

if __name__ == "__main__":
    generate_fake_data(num_students=10, num_projects_per_student=3)
    # You can change the numbers above to generate more or fewer students/projects