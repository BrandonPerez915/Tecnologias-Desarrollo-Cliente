import { Component, output } from '@angular/core';
import { User } from '../../interfaces/user';

@Component({
  imports: [],
  selector: 'app-users-table',
  templateUrl: './users-table.html',
})
export class UsersTable {
  readonly userSelected = output<User>();

  readonly users: User[] = [
    {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      website: 'www.johndoe.com',
      company: {
        name: 'Doe Enterprises',
        catchPhrase: 'Innovating the Future',
        bs: 'business solutions',
      },
    },
    {
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      phone: '098-765-4321',
      website: 'www.janesmith.com',
      company: {
        name: 'Smith & Associates',
        catchPhrase: 'Building Dreams, Delivering Excellence',
        bs: 'strategic partnerships',
      },
    },
    {
      name: 'Alice Johnson',
      username: 'alicejohnson',
      email: 'alice.johnson@example.com',
      phone: '555-123-4567',
      website: 'www.alicejohnson.com',
      company: {
        name: 'Johnson & Co.',
        catchPhrase: 'Creating Value, Delivering Results',
        bs: 'innovative solutions',
      },
    },
    {
      name: 'Bob Williams',
      username: 'bobwilliams',
      email: 'bob.williams@example.com',
      phone: '555-987-6543',
      website: 'www.bobwilliams.com',
      company: {
        name: 'Williams & Associates',
        catchPhrase: 'Driving Innovation, Delivering Success',
        bs: 'cutting-edge technology',
      },
    },
    {
      name: 'Emily Brown',
      username: 'emilybrown',
      email: 'emily.brown@example.com',
      phone: '555-555-5555',
      website: 'www.emilybrown.com',
      company: {
        name: 'Brown & Associates',
        catchPhrase: 'Empowering People, Transforming Lives',
        bs: 'empowerment and development',
      },
    },
    {
      name: 'David Davis',
      username: 'daviddavis',
      email: 'david.davis@example.com',
      phone: '555-111-2222',
      website: 'www.daviddavis.com',
      company: {
        name: 'Davis & Co.',
        catchPhrase: 'Driving Progress, Delivering Results',
        bs: 'progressive solutions',
      },
    },
    {
      name: 'Eve Wilson',
      username: 'evewilson',
      email: 'eve.wilson@example.com',
      phone: '555-333-4444',
      website: 'www.evewilson.com',
      company: {
        name: 'Wilson & Co.',
        catchPhrase: 'Empowering People, Transforming Lives',
        bs: 'empowerment and development',
      },
    }
  ];

  handleUserClick(user: User) {
    this.userSelected.emit(user);
  }
}
