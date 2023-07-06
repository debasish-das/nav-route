package addition.add2no;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.Scanner;

@SpringBootApplication
public class Add2noApplication {

	public static void main(String[] args) {
		SpringApplication.run(Add2noApplication.class, args);

		 int x, y, sum;
        Scanner sc = new Scanner(System.in);
        System.out.println( "Enter first no:" );
        x= sc.nextInt();

        System.out.println("Enter second no:");
        y=sc.nextInt();

        sum=x+y;
        System.out.println("Sum is:"+sum);
        sc.close();
    }


	}


