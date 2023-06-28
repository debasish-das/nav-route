package com.addition;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class add2no extends HttpServlet {
    public void processRequest (HttpServletRequest request, HttpServletResponse response)
    throws IOException{
        response.setContentType("text/html; charset-UTF-8");
        PrintWriter out=response.getWriter();
        try{
        out.println("<html>");
        out.println("<body>");
        int x=Integer.parseInt(request.getParameter("num1"));
        int y=Integer.parseInt(request.getParameter("num2"));
        int sum = x + y;
        out.println("<h1>Addition:" + sum +"</h1>");
        out.println("</body>");
        out.println("</html>");
        }
        catch(Exception e){
            e.printStackTrace();
        }

    }
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws 
    ServletException, IOException{ 
        processRequest(request, response);
    }
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws 
    ServletException, IOException{
        processRequest(request, response);
    }
}