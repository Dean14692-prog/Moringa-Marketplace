import os
from datetime import datetime, timedelta
from random import choice, randint, uniform
from faker import Faker
from app import app ,db
from models import User, Role, Project, Review, Order, OrderItem, Merchandise, UserProject 
from flask_bcrypt import Bcrypt

fake = Faker()
bcrypt = Bcrypt(app)

def clear_data():
    """Clears existing data from tables in dependency order, based ONLY on the provided diagram."""
    with app.app_context():
        print("Clearing existing data...")
        # Clear tables 
        db.session.query(Review).delete()
        db.session.query(OrderItem).delete()
        db.session.query(Order).delete()
        db.session.query(UserProject).delete()
        db.session.query(Merchandise).delete()
        db.session.query(Project).delete()
        db.session.query(User).delete()
        db.session.query(Role).delete()

        db.session.commit()
        print("Existing data cleared.")

def seed_database():
    """Seeds the database with sample data based ONLY on the schema in 'Screenshot from 2025-07-21 15-51-56.jpg'."""
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        print("Starting database seeding...")

        print("Seeding Roles...")
        admin_role = Role(name='admin')
        student_role = Role(name='student')
        db.session.add_all([admin_role, student_role])
        db.session.commit()
        print("Seeded Roles.")

        # --- Users (Table: users) ---
        print("Seeding Users...")
        users = []
        admin_role_obj = Role.query.filter_by(name='admin').first()
        student_role_obj = Role.query.filter_by(name='student').first()

        admin_user = User.create(
            first_name="Admin",
            last_name="System",
            email="admin@example.com",
            password="adminpassword", 
            username="adminuser",
            role_id=admin_role_obj.id,
            profile_pic="https://example.com/admin_profile.jpg",
            github_link=None,
            linkedin_link=None, 
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        users.append(admin_user)

        student_user = User.create(
            first_name="Student",
            last_name="Learner",
            email="student@example.com",
            password="studentpassword",
            username="studentuser",
            role_id=student_role_obj.id,
            profile_pic="https://example.com/student_profile.jpg",
            github_link="https://github.com/student_learner",
            linkedin_link="https://linkedin.com/in/student_learner",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        users.append(student_user)
        for _ in range(13):
            chosen_role = choice([admin_role_obj, student_role_obj]) 
            
            while True:
                new_email = fake.unique.email()
                if new_email not in ["admin@example.com", "student@example.com"]:
                    break

            user = User.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=new_email,
                password="password123",
                username=fake.unique.user_name(),
                role_id=chosen_role.id,
                profile_pic=fake.image_url() if randint(0, 1) else None,
                github_link=fake.url() if chosen_role.name == 'student' and randint(0, 1) else None,
                linkedin_link=fake.url() if chosen_role.name == 'student' and randint(0, 1) else None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            users.append(user)
        print(f"Created {len(users)} Users.")

        # --- Projects (Table: projects) ---
        print("Seeding Projects...")
        projects = []
        categories = ["Web Development", "Mobile App", "Data Science", "Machine Learning", "Game Development", "UI/UX Design"]
        
      

        for i in range(25):
            project = Project.create(
                title=fake.catch_phrase(),
                description=fake.paragraph(nb_sentences=5),
                category=choice(categories),
                github_link=fake.url(),
                live_preview_link=fake.url() if randint(0,1) else None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            projects.append(project)
        print(f"Created {len(projects)} Projects.")

        print("Seeding User_Projects (Many-to-Many between Users and Projects)...")
        user_projects = []
        for _ in range(10): 
            user = choice(users)
            project = choice(projects)
            
            # Avoid duplicate user-project entries
            existing_entry = UserProject.query.filter_by(user_id=user.id, project_id=project.id).first()
            if not existing_entry:
                user_project = UserProject.create(
                    user_id=user.id,
                    project_id=project.id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                user_projects.append(user_project)
            else:
                print(f"Skipping duplicate UserProject for User {user.id} and Project {project.id}")
        db.session.commit()
        print(f"Created {len(user_projects)} User_Projects entries.")

        print("Seeding Reviews...")
        reviews = []
        for _ in range(30):
            review = Review.create(
                user_id=choice(users).id,
                project_id=choice(projects).id, 
                comment=fake.sentence(),
                rating=randint(1, 5),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            reviews.append(review)
        print(f"Created {len(reviews)} Reviews.")

        print("Seeding Merchandise...")
        merchandise_items = []
        merchandise_categories = ["Apparel", "Homeware", "Electronics", "Books", "Accessories"] 
        for _ in range(12):
            merchandise = Merchandise.create(
                name=fake.word().capitalize() + " " + choice(["T-Shirt", "Mug", "Sticker", "Hoodie", "Notebook"]),
                description=fake.sentence(),
                price=round(uniform(5.0, 50.0), 2),
                image_url=fake.image_url(),
                category=choice(merchandise_categories),
                stock_quantity=randint(10, 200),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            merchandise_items.append(merchandise)
        print(f"Created {len(merchandise_items)} Merchandise items.")

        print("Seeding Orders and OrderItems...")
        orders = []
        order_statuses = ["pending", "completed", "cancelled"] 
        for _ in range(15):
            buyer = choice(users)
            order = Order.create(
                user_id=buyer.id, 
                status=choice(order_statuses),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            orders.append(order)
            db.session.add(order) 
            db.session.flush() 

            num_items = randint(1, 5)
            order_total = 0.0
            for _ in range(num_items):
                merchandise = choice(merchandise_items)
                quantity = randint(1, 3)
                order_item = OrderItem.create(
                    order_id=order.id,
                    merchandise_id=merchandise.id, 
                    quantity=quantity
                )
                order_total += quantity * merchandise.price
           
            db.session.commit()

        print(f"Created {len(orders)} Orders with items.")

        print("Database seeding complete!")

if __name__ == "__main__":
    with app.app_context():
        clear_data()
        seed_database()