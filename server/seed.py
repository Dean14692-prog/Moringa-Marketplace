from app import app, db 
from models import User, Role, Project, UsersProject, Review, Merchandise, Order, OrderItem
from datetime import datetime
import random


with app.app_context():
    print("Dropping all tables...")
    db.drop_all() 
    print("Creating all tables...")
    db.create_all() 

    print("Seeding roles...")
    
    admin_role = Role.create(name='admin')
    student_role = Role.create(name='student')
    user_role = Role.create(name='user')
    db.session.add_all([admin_role, student_role, user_role])
    db.session.commit()
    print("Roles seeded.")

    print("Seeding users...")
    
    user1 = User.create(
        username='adminuser',
        first_name='Admin',
        last_name='One',
        email='admin@moringaschool.com',
        password='adminpassword',
        role_id=admin_role.id,
        bio='Main administrator of the marketplace.',
        profile_pic='https://placehold.co/150x150/000000/FFFFFF?text=Admin1'
    )

    user2 = User.create(
        username='studentdev',
        first_name='Student',
        last_name='Developer',
        email='student@moringaschool.com',
        password='studentpassword',
        role_id=student_role.id,
        bio='Passionate student developer looking for opportunities.',
        profile_pic='https://placehold.co/150x150/FF0000/FFFFFF?text=Student1',
        github='https://github.com/studentdev',
        linkedin='https://linkedin.com/in/studentdev',
        skills='Python, Flask, React, SQL'
    )

    user3 = User.create(
        username='generaluser',
        first_name='General',
        last_name='User',
        email='user@example.com',
        password='userpassword',
        role_id=user_role.id,
        bio='Regular user browsing projects and merchandise.',
        profile_pic='https://placehold.co/150x150/00FF00/000000?text=User1'
    )

    user4 = User.create(
        username='anotherstudent',
        first_name='Another',
        last_name='Student',
        email='another@moringaschool.com',
        password='anotherpassword',
        role_id=student_role.id,
        bio='Learning and building cool stuff.',
        profile_pic='https://placehold.co/150x150/0000FF/FFFFFF?text=Student2',
        github='https://github.com/anotherstudent',
        linkedin='https://linkedin.com/in/anotherstudent',
        skills='JavaScript, Node.js, MongoDB'
    )
    db.session.add_all([user1, user2, user3, user4])
    db.session.commit()
    print("Users seeded.")

    print("Seeding projects...")
    
    project1 = Project.create(
        title='E-commerce Platform',
        description='A full-stack e-commerce solution with user authentication, product catalog, and payment gateway integration.',
        category='Web Development',
        tech_stack='React, Flask, PostgreSQL',
        github_link='https://github.com/studentdev/ecommerce-platform',
        live_preview_url='https://ecommerce.example.com',
        isForSale=True,
        price=1500.00,
        isApproved=True,
        status_changed_by=user1.username, 
        uploaded_by=user2.username 
    )

    project2 = Project.create(
        title='AI Chatbot for Customer Support',
        description='An intelligent chatbot designed to handle common customer inquiries, reducing support load.',
        category='Artificial Intelligence',
        tech_stack='Python, TensorFlow, NLTK',
        github_link='https://github.com/anotherstudent/ai-chatbot',
        live_preview_url='https://chatbot.example.com',
        isForSale=False,
        price=0.0,
        isApproved=False, 
        status_changed_by=None,
        uploaded_by=user4.username 
    )

    project3 = Project.create(
        title='Mobile Task Manager App',
        description='A cross-platform mobile application for managing daily tasks and to-do lists.',
        category='Mobile Development',
        tech_stack='React Native, Firebase',
        github_link='https://github.com/studentdev/task-manager-app',
        live_preview_url='https://taskapp.example.com',
        isForSale=True,
        price=800.00,
        isApproved=True,
        status_changed_by=user1.username,
        uploaded_by=user2.username
    )
    db.session.add_all([project1, project2, project3])
    db.session.commit()
    print("Projects seeded.")

    print("Seeding users_projects (user actions/involvements)...")
    
    up1 = UsersProject.create(user_id=user2.id, project_id=project1.id, action='uploading')
    
    up2 = UsersProject.create(user_id=user2.id, project_id=project1.id, action='commenting')
    
    up3 = UsersProject.create(user_id=user4.id, project_id=project2.id, action='uploading')
    
    up4 = UsersProject.create(user_id=user3.id, project_id=project1.id, action='liking')
    
    up5 = UsersProject.create(user_id=user1.id, project_id=project1.id, action='approving')
    
    up6 = UsersProject.create(user_id=user2.id, project_id=project3.id, action='uploading')
    db.session.add_all([up1, up2, up3, up4, up5, up6])
    db.session.commit()
    print("UsersProject entries seeded.")

    print("Seeding reviews...")
    
    review1 = Review.create(user_project_id=up1.id, rating=5.0, comment='Excellent upload, very comprehensive!')
    
    review2 = Review.create(user_project_id=up2.id, rating=4.0, comment='Helpful comments, good insights.')
    
    review3 = Review.create(user_project_id=up3.id, rating=4.5, comment='Promising AI project, looking forward to approval.')
    
    review4 = Review.create(user_project_id=up4.id, rating=5.0, comment='This project is awesome!')
    db.session.add_all([review1, review2, review3, review4])
    db.session.commit()
    print("Reviews seeded.")

    print("Seeding merchandise...")
    
    merchandise1 = Merchandise.create(
        name='Moringa Branded T-Shirt',
        description='High-quality cotton t-shirt with Moringa School logo.',
        price=25.00,
        image_url='https://placehold.co/300x200/000000/FFFFFF?text=T-Shirt',
        stock_quantity=100
    )

    merchandise2 = Merchandise.create(
        name='Moringa Water Bottle',
        description='Stainless steel water bottle, 500ml capacity.',
        price=15.00,
        image_url='https://placehold.co/300x200/000000/FFFFFF?text=WaterBottle',
        stock_quantity=50
    )
    db.session.add_all([merchandise1, merchandise2])
    db.session.commit()
    print("Merchandise seeded.")

    print("Seeding orders...")
    
    order1 = Order.create(user_id=user3.id, total_amount=40.00, payment_status='Completed')
    order2 = Order.create(user_id=user2.id, total_amount=25.00, payment_status='Pending') 
    db.session.add_all([order1, order2])
    db.session.commit()
    print("Orders seeded.")

    print("Seeding order items...")
    
    order_item1 = OrderItem.create(order_id=order1.id, merchandise_id=merchandise1.id, quantity=1, unit_price=merchandise1.price)
    order_item2 = OrderItem.create(order_id=order1.id, merchandise_id=merchandise2.id, quantity=1, unit_price=merchandise2.price)
    order_item3 = OrderItem.create(order_id=order2.id, merchandise_id=merchandise1.id, quantity=1, unit_price=merchandise1.price)
    db.session.add_all([order_item1, order_item2, order_item3])
    db.session.commit()
    print("Order items seeded.")

    print("Database seeding complete!")
